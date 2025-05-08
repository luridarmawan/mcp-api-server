package routes

import (
	"apiserver/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func EmployeeRoutes(router fiber.Router) {
	employee := router.Group("/employee")
	employee.Get("/list", handlers.GetEmployeeList)
	employee.Get("/occupation/", handlers.GetEmployeeOccupation)
}
