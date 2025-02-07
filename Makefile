.PHONY: all clean lint test

SOURCES := $(shell find doc src)

export PATH := ./node_modules/.bin:$(PATH)

all: index.html

clean:
	$(RM) index.html
	$(RM) -r build/

index.html: $(SOURCES)
	tsc --version
	tiddlywiki --version
	mkdir -p build/plugins/swn
	cp -r doc/* build/
	cp -r src/* build/plugins/swn/
	tsc
	tiddlywiki ./build --verbose --build

lint:
	tslint --format stylish --project .

test:
	tsc --version
	jest --version
	npm show ts-jest version
	jest
