package services

import (
	"apiserver/internal/config"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
)

func OCRNanonetByURL(modelId string, urls []string) (interface{}, error) {

	// TODO: mapping modelId

	apiKey := config.Cfg.OcrNanonetKey
	endpoint := fmt.Sprintf("https://app.nanonets.com/api/v2/OCR/Model/%s/LabelUrls/", modelId)

	// Gabungkan semua URL menjadi satu string dengan separator koma
	urlsStr := strings.Join(urls, ",")

	// Siapkan form data
	formData := url.Values{}
	formData.Add("urls", urlsStr)

	// Buat request
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(formData.Encode()))
	if err != nil {
		return nil, fmt.Errorf("gagal membuat request: %v", err)
	}

	// Set headers
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Accept", "application/x-www-form-urlencoded")

	// Set basic auth
	req.SetBasicAuth(apiKey, "")

	// Buat HTTP client
	client := &http.Client{}

	// Kirim request
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gagal mengirim request: %v", err)
	}
	defer resp.Body.Close()

	// Baca response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca response: %v", err)
	}

	// Cek status code
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("response error dengan status code %d: %s", resp.StatusCode, string(body))
	}

	// Parse response JSON
	var result interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("gagal parse response JSON: %v", err)
	}

	return fmt.Errorf("ocr nanonet"), nil
}
