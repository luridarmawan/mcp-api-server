package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"apiserver/internal/handlers"
	_ "apiserver/internal/docs" // Swagger docs
)

func SetupRoutes(app *fiber.App) {
	app.Get("/swagger/*", swagger.HandlerDefault)

	api := app.Group("/api")
	api.Post("/mcp", handlers.HandleMCP)
}
