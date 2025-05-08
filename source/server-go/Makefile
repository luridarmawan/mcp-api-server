###
# make run       # untuk menjalankan
# make docs   # untuk generate OpenAPI docs
# make build     # untuk build binary ke bin/mcp-server
# make tidy      # untuk membersihkan dan sinkronkan dependensi

dev:
	gow run cmd/server/main.go

run:
	go run ./cmd/server

docs:
	swag init --dir ./cmd/server --output ./internal/docs --outputTypes json,yaml

build:
	go mod tidy
	go build -o bin/api-server ./cmd/server

tidy:
	go mod tidy
