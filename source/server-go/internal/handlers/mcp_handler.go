package handlers

import (
	"apiserver/internal/services"

	"github.com/gofiber/fiber/v2"
)

// HandleMCP godoc
// @Summary Execute MCP request
// @Description Handle MCP request processing
// @Tags MCP
// @Accept json
// @Produce json
// @Param request body map[string]interface{} true "MCP Request"
// @Success 200 {object} map[string]interface{} "Success response"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /mcp [post]
func HandleMCP(c *fiber.Ctx) error {
	var req map[string]interface{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}
	resp := services.ExecuteMCP(req)
	return c.JSON(resp)
}
