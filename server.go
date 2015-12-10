// Copyright 2015 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"bufio"
	"flag"
	"strings"
	"log"
	"net/http"
	"io"
	"os"
	"time"
	"os/exec"
	"github.com/gorilla/websocket"
	"fmt"
	"encoding/json"
)

var (
	addr    = flag.String("addr", "0.0.0.0:8080", "http service address")
	cmdPath string
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// Default is to return false. Accept any origin for testing
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}

	defer ws.Close()

	path := "pmdumptext"
	args := []string{
		"disk.dev.write_bytes",
		"disk.dev.read_bytes",
		"network.interface.in.bytes",
		"network.interface.out.bytes",
		"kernel.all.cpu.user",
		"kernel.all.cpu.sys",
		"kernel.all.cpu.idle",
		"kernel.all.cpu.wait.total",
		"kernel.all.cpu.irq.hard",
		"kernel.all.cpu.irq.soft",
		"--delimiter=~",
		"--time-format=%I:%M:%S",
		"-t 1.0",
		"-U0.0"}

	cmd := exec.Command(path, args...)

	// Create stdout streams of type io.Reader
	stdout, _ := cmd.StdoutPipe()

	// Start command
	cmd.Start()

	// Don't exit before our command has finished running
	defer cmd.Wait()

	// Parse to JSON then echo command output through the Web Socket
	go func(reader io.Reader) {
		scanner := bufio.NewScanner(reader)
		for scanner.Scan() {

			// Split on delimiter set in command
			s := strings.Split(scanner.Text(), "~")

			// Map the outputs to a Name: output
			map_s := map[string]string{
				"time":                        s[0],
				"disk_dev_write_bytes":        s[1],
				"disk_dev_read_bytes":         s[2],
				"network_interface_in_bytes":  s[4],
				"network_interface_out_bytes": s[7],
				"kernel_all_cpu_user":         s[9],
				"kernel_all_cpu_sys":          s[10],
				"kernel_all_cpu_idle":         s[11],
				"kernel_all_cpu_wait_total":   s[12],
				"kernel_all_cpu_irq_hard":     s[13],
				"kernel_all_cpu_irq_soft":     s[14]}

			map_s_json, _ := json.Marshal(map_s)

			ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.WriteMessage(websocket.TextMessage, []byte(string(map_s_json))); err != nil {
				break
			}
		}
		if err := scanner.Err(); err != nil {
			fmt.Fprintln(os.Stderr, "There was an error with the scanner", err)
		}
	}(stdout)

}

func main() {
	http.HandleFunc("/ws", serveWs)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
