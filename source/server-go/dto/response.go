package dto

// BaseResponse godoc
// @Schema
type BaseResponse struct {
	// @Example true
	Success bool `json:"success"`
	// @Example 99
	Code int         `json:"code"`
	Data interface{} `json:"data"`
}

// ErrorResponse godoc
// @Schema
type ErrorResponse struct {
	// @Example false
	Success bool `json:"success"`
	// @Example "Invalid request"
	Message string `json:"message"`
}

type OccupationResponse struct {
	Occupation string `json:"occupation"`
}
