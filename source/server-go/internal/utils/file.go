package utils

import (
	"os"
)

// ReadFile reads the content of a file and returns as bytes.
func ReadFile(path string) ([]byte, error) {
	return os.ReadFile(path)
}
