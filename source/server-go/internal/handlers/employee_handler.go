package handlers

import (
	"apiserver/internal/models"
	"apiserver/internal/utils"
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// GetEmployeeList godoc
// @Summary Get employee list
// @Tags Employee
// @Description Retrieve a paginated list of all employees
// @Produce json
// @Security BearerAuth
// @Success 200 {object} object{success=bool,code=int,data=[]object} "Success response" Example({"success":true,"code":0,"data":[{...}]})
// @Failure 500 {object} dto.ErrorResponse
// @Router /employee/list [get]
func GetEmployeeList(c *fiber.Ctx) error {
	// Read the file
	data, err := utils.ReadFile("data/employee.json")
	if err != nil {
		return utils.Output(c, "failed to read employee data", false, 500)
	}

	var employees []models.Employee
	err = json.Unmarshal(data, &employees)
	if err != nil {
		return utils.Output(c, "invalid employee data format", false, 500)
	}

	// Return success response
	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data":    employees,
	})
}

// GetEmployeeOccupation godoc
// @Summary Get employee occupations
// @Tags Employee
// @Description Retrieve available occupations, optionally filtered by employee code
// @Produce json
// @Param code query string false "Filter by employee code"
// @Success 200 {object} dto.BaseResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /employee/occupation [get]
func GetEmployeeOccupation(c *fiber.Ctx) error {
	code := c.Query("code", "")

	// Read file
	data, err := utils.ReadFile("data/occupation.json")
	if err != nil {
		return utils.Output(c, "failed to read occupation data", false, 500)
	}

	var occupations []models.Occupation
	err = json.Unmarshal(data, &occupations)
	if err != nil {
		return utils.Output(c, "invalid occupation data format", false, 500)
	}

	if code != "" {
		// Find by employee_code (case-insensitive)
		for _, emp := range occupations {
			if strings.EqualFold(emp.EmployeeCode, code) {
				return c.Status(200).JSON(fiber.Map{
					"success": true,
					"code":    0,
					"data":    []models.Occupation{emp},
				})
			}
		}
		// Not found
		return utils.Output(c, "Not Found", false, 404)
	}

	// No code: return full list
	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"code":    0,
		"data":    occupations,
	})
}
