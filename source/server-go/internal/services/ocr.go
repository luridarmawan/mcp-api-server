package services

import "fmt"

// ProxyOCRURLVendor memproses request OCR ke vendor
func ProxyOCRURLVendor(modelId string, urls []string, platform string) (interface{}, error) {

	switch platform {
	case "nanonet":
		return OCRNanonetByURL(modelId, urls)
	case "ximply":
		return OCRXimplyByURL(modelId, urls)
	default:
		return nil, fmt.Errorf("platform OCR '%s' tidak didukung", platform)
	}

	// return nil, nil
}
