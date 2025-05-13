###
# make run       # untuk menjalankan
# make docs   # untuk generate OpenAPI docs
# make build     # untuk build binary ke bin/mcp-server
# make tidy      # untuk membersihkan dan sinkronkan dependensi

APP_NAME = api-server
OUTPUT_DIR = bin
PACKAGE := apiserver/internal

VERSION := $(shell git describe --tags --always 2>/dev/null || echo "dev")
GIT_COMMIT := $(shell git rev-parse --short HEAD)
BUILD_DATE := $(shell date -u +%Y-%m-%dT%H:%M:%SZ)
LDFLAGS := -X $(PACKAGE)/config.Version=$(VERSION) -X $(PACKAGE)/config.GitCommit=$(GIT_COMMIT) -X $(PACKAGE)/config.BuildDate=$(BUILD_DATE)

dev:
	make docs
	gow run cmd/server/main.go

docs:
	rm -rf internal/docs/swagger.*
	swag init --dir . \
	  --generalInfo ./cmd/server/main.go \
	  --output ./internal/docs \
	  --outputTypes json,yaml \
	  --parseDependency false \
	  --parseInternal false \
	  --parseVendor false \
	  --exclude ./data,./bin,sync/atomic

build:
	go mod tidy
	make docs
	# go build -o bin/api-server ./cmd/server
	go build -o $(OUTPUT_DIR)/$(APP_NAME) -ldflags "$(LDFLAGS)" ./cmd/server

build-arm64:
	go mod tidy
	make docs
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -o $(OUTPUT_DIR)/$(APP_NAME)-arm64 -ldflags "$(LDFLAGS)" ./cmd/server


tidy:
	go mod tidy
