// dto/ocr.go
package dto

// OcrRequest defines model for OCR request payload
type OcrRequest struct {
	// @Example ["https://example.com/image1.jpg"]
	Urls []string `json:"urls" validate:"required,min=1"`
}
