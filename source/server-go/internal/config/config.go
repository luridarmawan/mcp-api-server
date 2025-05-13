package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName            string
	AppPort            string
	Debug              bool
	OcrPlatformDefault string
	OcrXimplyKey       string
	OcrNanonetKey      string
	JWTSecret          string

	// Build info
	Version   string
	GitCommit string
	BuildDate string
}

// Global variable to hold loaded config
var Cfg Config

// These variables are injected at build time using -ldflags
var (
	Version   string
	GitCommit string
	BuildDate string
)

// LoadConfig reads environment variables and fills the config struct
func LoadConfig() {
	_ = godotenv.Load() // Optional: load .env file if exists

	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	Cfg = Config{
		AppName:            getEnv("APP_NAME", "MCP Server"),
		AppPort:            getEnv("APP_PORT", "8080"),
		Debug:              getEnv("DEBUG", "false") == "true",
		OcrPlatformDefault: getEnv("OCR_PLATFORM_DEFAULT", ""),
		OcrXimplyKey:       getEnv("XIMPLY_OCR_API_KEY", ""),
		OcrNanonetKey:      getEnv("NANONET_API_KEY", ""),
		JWTSecret:          getEnv("JWT_SECRET", "your-secret-key"), // Default secret key, sebaiknya diganti di production

		// Inject build-time values
		Version:   Version,
		GitCommit: GitCommit,
		BuildDate: BuildDate,
	}
}

// getEnv reads a key from the environment with a fallback default
func getEnv(key string, defaultVal string) string {
	if val, exists := os.LookupEnv(key); exists {
		return val
	}
	return defaultVal
}
