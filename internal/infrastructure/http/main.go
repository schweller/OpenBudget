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
	incomeHandler := NewIncomeHandler(c.IncomeService)
	labelHandler := NewLabelHandler(c.LabelService)
	srv.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Access-Control-Allow-Origin", "*")
			c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Response().Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if c.Request().Method == "OPTIONS" {
				return c.NoContent(204)
			}
			return next(c)
		}
	})
	srv.POST("/expenses", expenseHandler.handleCreateExpense)
	srv.PUT("/expenses/:id", expenseHandler.handleUpdateExpense)
	srv.POST("/expenses/:expense_id/labels/:label_id", expenseHandler.handleAddLabel)

	srv.GET("/expenses", expenseHandler.handleGetAllExpenses)
	srv.GET("/expenses/:id", expenseHandler.handleGetExpenseById)
	srv.GET("/expenses/by_month/:year/:month", expenseHandler.handleGetMonthlyExpenses)

	srv.GET("/incomes", incomeHandler.handleGetAllIncomes)
	srv.GET("/incomes/by_month/:year/:month", incomeHandler.handleGetMonthlyIncomes)
	srv.POST("/incomes", incomeHandler.handleCreateIncome)

	srv.GET("/labels", labelHandler.handleGetLabels)
	srv.POST("/labels", labelHandler.handleCreateLabel)
}
