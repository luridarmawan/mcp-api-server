package middleware

import (
	"apiserver/internal/utils"
	"slices"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func isAllowedPath(path string) bool {
	allowed := []string{
		"/auth/login",
		"/auth/register",
		"/docs",
		"/docs/openapi.json",
		"/employee/list",       // data demo only
		"/employee/occupation", // data demo only
	}
	return slices.Contains(allowed, path)
}

// AuthMiddleware adalah middleware untuk memverifikasi token JWT
func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Skip middleware untuk endpoint yang tidak memerlukan autentikasi
		path := c.Path()
		if isAllowedPath(path) {
			return c.Next()
		}

		// Ambil token dari header Authorization (case insensitive)
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			authHeader = c.Get("authorization")
		}

		if authHeader == "" {
			return utils.Output(c, "Unauthorized: Missing token", false, 401)
		}

		// Format token harus "Bearer <token>" (case insensitive)
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
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
