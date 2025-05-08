// @title           My API
// @version         1.0.0
// @description     API Documentation.
// @contact.name    CARIK Team
// @contact.email   halo@carik.id
// @host            localhost:8081
// @BasePath        /api
// package main
package main

import (
	"apiserver/internal/config"
	"apiserver/internal/routes"
	"fmt"
	"log"
	"os"

	_ "apiserver/internal/docs" // this will generate docs automatically

	"github.com/gofiber/fiber/v2"
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

	// debug header
	// app.Use(func(c *fiber.Ctx) error {
	// 	fmt.Println("Headers received:", c.GetReqHeaders())
	// 	return c.Next()
	// })

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Get("/docs/openapi.json", func(c *fiber.Ctx) error {
		data, err := os.ReadFile("./internal/docs/swagger.json")
		if err != nil {
			return c.Status(500).SendString("Failed to load OpenAPI spec")
		}
		c.Set("Content-Type", "application/json")
		return c.Send(data)
	})

	// Document UI route
	app.Get("/docs", func(c *fiber.Ctx) error {
		data, _ := os.ReadFile("./internal/docs/redoc.html")
		html := string(data)
		c.Set("Content-Type", "text/html")
		return c.SendString(html)
	})

	routes.SetupRoutes(app)

	// Start Server
	port := config.Cfg.AppPort
	err := app.Listen(":" + port)
	if err != nil {
		log.Fatal("Error starting server: ", err)
	}
	fmt.Printf("Server is running on port %s...\n", port)
}
