package models

type Employee struct {
	ID       int    `json:"id"`
	Code     string `json:"code"`
	FullName string `json:"fullname"`
	City     string `json:"city"`
}
