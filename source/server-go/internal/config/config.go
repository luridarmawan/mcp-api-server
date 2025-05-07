package config

import (
	// "log"
	"os"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2"
)

type Config struct {
	AppName  string
	AppPort  string
	Debug    bool
}

var Cfg Config

func LoadConfig() {
	_ = godotenv.Load() // silently load .env (ignore error if missing)

	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	Cfg = Config{
		AppName:  getEnv("APP_NAME", "MCP Server"),
		AppPort:  getEnv("APP_PORT", "8080"),
		Debug:    getEnv("DEBUG", "false") == "true",
	}
}

func getEnv(key string, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func NewFiberApp() *fiber.App {
	app := fiber.New()
	return app
}
