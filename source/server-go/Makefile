###
# make run       # untuk menjalankan
# make docs   # untuk generate OpenAPI docs
# make build     # untuk build binary ke bin/mcp-server

run:
	go run ./cmd/server

docs:
	swag init --dir ./cmd/server --output ./internal/docs --outputTypes json,yaml

build:
	go build -o bin/mcp-server ./cmd/server

