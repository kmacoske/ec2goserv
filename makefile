build:
	# go get -v
	go build -v server.go
	go build -v client.go

package: server
	mkdir -p package/bin
	mkdir -p package/dist
	cp server package/bin
	cd package; tar cvjf dist/server.tar.gz bin

clean:
	# remove to go get fresh new ones in every build
	rm -rf ../../../github.com/gorilla/mux
	rm -rf ../../../code.google.com/p/go-charset
	rm -rf package
