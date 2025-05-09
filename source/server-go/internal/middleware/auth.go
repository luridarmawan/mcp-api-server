package middleware

import (
	"apiserver/internal/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// AuthMiddleware adalah middleware untuk memverifikasi token JWT
func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Skip middleware untuk endpoint yang tidak memerlukan autentikasi
		path := c.Path()
		if path == "/auth/login" || path == "/auth/register" || path == "/docs" || path == "/docs/openapi.json" {
			return c.Next()
		}

		// Ambil token dari header Authorization
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return utils.Output(c, "Unauthorized: Missing token", false, 401)
		}

		// Format token harus "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return utils.Output(c, "Unauthorized: Invalid token format", false, 401)
		}

		token := parts[1]

		// Validasi token
		claims, err := utils.ValidateToken(token)
		if err != nil {
			return utils.Output(c, "Unauthorized: Invalid token", false, 401)
		}

		// Simpan data user di context untuk digunakan di handler
		c.Locals("user", claims)

		return c.Next()
	}
}
