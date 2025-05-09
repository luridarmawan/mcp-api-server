// @FileName ocr_handler.go
// @Description OCR handler
// @Tags OCR
// @Accept json
// @Accept multipart/form-data
// @Accept plain
// @Produce json
// @Param modelId path string true "Model ID" Example("model-123")
// @Param async query bool false "Async processing" Example(false) default(false) hidden(true)
// @Param body body dto.OcrRequest true "OCR Request" Example({"urls":["https://example.com/image1.jpg","https://example.com/image2.jpg"]})
// @Success 200 {object} object{success=bool,modelId=string,async=bool,received=[]string,result=object} "Success response" Example({"success":true,"modelId":"model-123","async":false,"received":["url1","url2"],"result":{"predictions":[...]}})
// @Failure 400 {object} object{success=bool,error=string} "Bad Request" Example({"success":false,"error":"Invalid request body"})
// @Failure 500 {object} dto.ErrorResponse "Internal Server Error" Example({"success":false,"code":500,"message":"Internal server error"})
// @Router /ocr/labelUrls/{modelId} [post]
package handlers

import (
	"apiserver/dto"
	"apiserver/internal/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// OcrPredictFromURL godoc
// @Summary Prediction for Image URL
// @Tags OCR
// @Description Perform OCR prediction from provided image URLs
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param model_id path string true "Model ID" Example(ktp-123)
// // @Param async query bool false "Async processing" Example(false) default(false) hidden(true)
// @Param request body dto.OcrRequest true "Image URLs" Example({"urls":["https://example.com/image1.jpg"]})
// @Success 200 {object} object{success=bool,model_id=string,async=bool,received=[]string,result=object} "Success response" Example({"success":true,"modelId":"model-123","async":false,"received":["url1"],"result":{"predictions":[{"label":"text","confidence":0.95}]}})
// @Failure 400 {object} object{success=bool,error=string} "Bad Request" Example({"success":false,"error":"Invalid request body"})
// @Failure 500 {object} dto.ErrorResponse "Internal Server Error" Example({"success":false,"code":500,"message":"OCR processing failed"})
// @Router /ocr/predict_url/{model_id} [post]
func OcrPredictFromURL(c *fiber.Ctx) error {
	modelId := c.Params("model_id")
	//async := c.QueryBool("async", false) // prepare untuk async method

	var payload dto.OcrRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Output(c, "Invalid request body", false)
	}

	//TODO: Logika pemrosesan OCR
	fmt.Println(string(payload.Urls[0]))

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"modelId": modelId,
		// "async":    async, // prepare untuk async method
		"received": payload.Urls,
		"result": map[string]interface{}{
			"predictions": []map[string]interface{}{
				{
					"label":      "sample-text",
					"confidence": 0.95,
					"bounding_box": map[string]float64{
						"x1": 10.5,
						"y1": 20.3,
						"x2": 100.2,
						"y2": 50.8,
					},
				},
			},
		},
	})
}

// OcrPredictFromFile godoc
// @Summary Prediction for Image File
// @Tags OCR
// @Description Perform OCR prediction from uploaded image file
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param model_id path string true "Model ID" Example(ktp-123)
// //@Param async query bool false "Async processing" Example(false)
// @Param file formData file true "Image File"
// @Success 200 {object} object{success=bool,model_id=string,filename=string,result=object} "Success response" Example({"success":true,"modelId":"model-123","filename":"image.jpg","result":{"predictions":[{"label":"text","confidence":0.95}]}})
// @Failure 400 {object} object{success=bool,error=string} "Bad Request" Example({"success":false,"error":"File not found"})
// @Failure 500 {object} object{success=bool,error=string} "Internal Server Error" Example({"success":false,"error":"OCR processing failed"})
// @Router /ocr/predict_file/{model_id} [post]
func OcrPredictFromFile(c *fiber.Ctx) error {
	modelId := c.Params("model_id")
	async := c.QueryBool("async", false)

	// Ambil file dari form
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "File not found in request",
		})
	}

	// Simpan file sementara (opsional)
	tempPath := fmt.Sprintf("./tmp/%s", file.Filename)
	if err := c.SaveFile(file, tempPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Failed to save uploaded file",
		})
	}

	//TODO: Logika pemrosesan OCR
	// Misal hasil dummy:
	predictionResult := map[string]interface{}{
		"predictions": []map[string]interface{}{
			{
				"label":      "sample-text",
				"confidence": 0.95,
			},
		},
	}

	// Hapus file jika perlu (opsional)
	// os.Remove(tempPath)

	return c.JSON(fiber.Map{
		"success":  true,
		"modelId":  modelId,
		"async":    async,
		"filename": file.Filename,
		"result":   predictionResult,
	})
}
