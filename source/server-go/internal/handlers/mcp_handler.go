package handlers

import (
	"github.com/gofiber/fiber/v2"
	"apiserver/internal/services"
)

// HandleMCP godoc
// @Summary Execute MCP request
// @Tags MCP
// @Accept json
// @Produce json
// @Param request body map[string]interface{} true "MCP Request"
// @Success 200 {object} map[string]interface{}
// @Router /api/mcp [post]
func HandleMCP(c *fiber.Ctx) error {
	var req map[string]interface{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}
	resp := services.ExecuteMCP(req)
	return c.JSON(resp)
}
