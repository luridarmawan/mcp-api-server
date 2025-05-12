package utils

import "github.com/gofiber/fiber/v2"

// Output is a helper to return a JSON response with optional success and status code.
// Usage:
// utils.Output(c, "ok")
// utils.Output(c, "created", true, 201)
// utils.Output(c, "error", false, 400)
func Output(c *fiber.Ctx, message string, successAndStatus ...interface{}) error {
	isSuccess := true
	statusCode := 200

	if len(successAndStatus) > 0 {
		// First optional param: success (bool)
		if s, ok := successAndStatus[0].(bool); ok {
			isSuccess = s
		}
	}
	if len(successAndStatus) > 1 {
		// Second optional param: status (int)
		if code, ok := successAndStatus[1].(int); ok {
			statusCode = code
		}
	}

	return c.Status(statusCode).JSON(fiber.Map{
		"success": isSuccess,
		"message": message,
	})
}
