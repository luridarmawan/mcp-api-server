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
	rm -rf internal/docs/swagger.*
	swag init --dir . \
	  --generalInfo cmd/server/main.go \
	  --output ./internal/docs \
	  --outputTypes json,yaml \
	  --parseDependency false \
	  --parseInternal false \
	  --parseVendor false \
	  --exclude ./data,./bin,sync/atomic

build:
	make docs
	go mod tidy
	go build -o bin/api-server ./cmd/server

tidy:
	go mod tidy
