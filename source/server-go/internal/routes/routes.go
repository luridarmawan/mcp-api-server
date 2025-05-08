package routes

import (
	_ "apiserver/internal/docs" // OpenAPI docs
	"apiserver/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// app.Get("/swagger/*", swagger.HandlerDefault)

	api := app.Group("/")
	EmployeeRoutes(api)

	api.Post("/mcp", handlers.HandleMCP)
}
