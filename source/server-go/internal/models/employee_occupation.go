package models

type Occupation struct {
	ID           int    `json:"id"`
	EmployeeCode string `json:"employee_code"`
	Title        string `json:"title"`
}
