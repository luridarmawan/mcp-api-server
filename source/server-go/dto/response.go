package dto

type BaseResponse struct {
	Success bool        `json:"success"`
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
}

type ErrorResponse struct {
	Success bool `json:"success"`
	Message int  `json:"message"`
}

type OccupationResponse struct {
	// Definisikan struktur data occupations di sini
	// Contoh:
	Occupation string `json:"occupation"`
	// atau sesuaikan dengan struktur aktual Anda
}
