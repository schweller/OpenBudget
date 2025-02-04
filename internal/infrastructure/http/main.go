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
	srv.POST("/expenses/:expense_id/labels/:label_id", expenseHandler.handleAddLabel)

	labelHandler := NewLabelHandler(c.LabelService)
	srv.POST("/label", labelHandler.handleCreateLabel)
}
