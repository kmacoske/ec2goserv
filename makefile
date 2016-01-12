all: build package

build:
	go get -v
	go build -v

package: project
	mkdir -p package/bin package/data
	cp -Rv data/* package/data
	cp project package/bin
	cd package; tar cvjf ../project.tar.gz bin data

clean:
	# remove to go get fresh new ones in every build
	rm -rf ../../../github.com/gorilla/mux
	rm -rf ../../../code.google.com/p/go-charset
	rm -rf package
	rm -f project.tar.gz