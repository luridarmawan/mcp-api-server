package main

import (
	"apiserver/internal/config"
	"apiserver/internal/routes"
	"fmt"
	"log"

	_ "apiserver/internal/docs" // this will generate docs automatically

	"github.com/gofiber/fiber/v2"
	swagger "github.com/swaggo/fiber-swagger"
)

func main() {
	config.LoadConfig()
	fmt.Printf("Starting %s on port %s...\n", config.Cfg.AppName, config.Cfg.AppPort)

	// Create Fiber app with increased header limit
	app := fiber.New(fiber.Config{
		ServerHeader: config.Cfg.AppName,
		// ReadBufferSize:        8192,  // Increase read buffer size
		ReadBufferSize:        16 * 1024, // 16KB (default: 4096)
		WriteBufferSize:       16 * 1024, // 16KB (default: 4096)
		DisableStartupMessage: false,     // Keep or set to true to disable startup message
	})

	routes.SetupRoutes(app)

	// debug header
	// app.Use(func(c *fiber.Ctx) error {
	// 	fmt.Println("Headers received:", c.GetReqHeaders())
	// 	return c.Next()
	// })

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	// Swagger UI route
	app.Get("/docs/*", swagger.WrapHandler) // Access Swagger UI at /docs

	port := config.Cfg.AppPort
	err := app.Listen(":" + port)
	if err != nil {
		log.Fatal("Error starting server: ", err)
	}
	fmt.Printf("Server is running on port %s...\n", port)
}
