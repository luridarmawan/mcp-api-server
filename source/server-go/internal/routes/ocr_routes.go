package routes

import (
	"apiserver/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func OCRRoutes(router fiber.Router) {
	ocr := router.Group("/ocr")
	ocr.Post("/predict_url/:model_id", handlers.OcrPredictFromURL)
	ocr.Post("/predict_file/:model_id", handlers.OcrPredictFromFile)
}
