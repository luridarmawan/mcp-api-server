package config

import (
	// "log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Config struct {
	AppName     string
	AppPort     string
	Debug       bool
	OcrPlatform string
	JWTSecret   string
}

var Cfg Config

func LoadConfig() {
	_ = godotenv.Load() // silently load .env (ignore error if missing)

	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	Cfg = Config{
		AppName:     getEnv("APP_NAME", "MCP Server"),
		AppPort:     getEnv("APP_PORT", "8080"),
		Debug:       getEnv("DEBUG", "false") == "true",
		OcrPlatform: getEnv("OCR_PLATFORM_DEFAULT", "xyz"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"), // Default secret key, sebaiknya diganti di production
	}
}

func getEnv(key string, fallback string) string {
	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	// Key yang dikecualikan dari suffix environment
	excludedKeys := map[string]bool{
		"APP_NAME": true,
		"APP_PORT": true,
		"DEBUG":    true,
	}

	var envKey string
	if excludedKeys[key] {
		envKey = key
	} else {
		var suffix string
		switch env {
		case "dev":
			suffix = "_DEV"
		case "staging":
			suffix = "_STG"
		case "prod", "production":
			suffix = "_PROD"
		default:
			suffix = "_DEV"
		}
		envKey = key + suffix
	}

	if value, exists := os.LookupEnv(envKey); exists {
		return value
	}
	return fallback
}

func NewFiberApp() *fiber.App {
	app := fiber.New()
	return app
}
