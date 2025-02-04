package http

import (
	"github.com/labstack/echo/v4"
	"github.com/schweller/expenzen/internal/domain/services"
)

type okResp struct {
	Data interface{} `json:"data"`
}

func InitHTTPHandlers(srv *echo.Echo, c *services.Container) {

	expenseHandler := NewExpenseHandler(c.ExpenseService)
	srv.POST("/expenses", expenseHandler.handleCreateExpense)

	labelHandler := NewLabelHandler(c.LabelService)
	srv.POST("/label", labelHandler.handleCreateLabel)
}
