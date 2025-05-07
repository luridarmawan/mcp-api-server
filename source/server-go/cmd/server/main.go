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

	// app := config.NewFiberApp()
	app := fiber.New()
	routes.SetupRoutes(app)

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
