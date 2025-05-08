###
# make run       # untuk menjalankan
# make swagger   # untuk generate Swagger docs
# make build     # untuk build binary ke bin/mcp-server

run:
	go run ./cmd/server

docs:
	swag init --dir ./cmd/server --output ./internal/docs --outputTypes json,yaml

swagger:
	swag init --dir ./cmd/server --output ./internal/docs

build:
	go build -o bin/mcp-server ./cmd/server

