package http

import (
	"github.com/labstack/echo/v4"
	"github.com/schweller/openbudget/internal/domain/services"
)

type okResp struct {
	Data interface{} `json:"data"`
}

func InitHTTPHandlers(srv *echo.Echo, c *services.Container) {

	expenseHandler := NewExpenseHandler(c.ExpenseService, c.ExpenseGroupService)
	incomeHandler := NewIncomeHandler(c.IncomeService)
	labelHandler := NewLabelHandler(c.LabelService)
	srv.POST("/expenses", expenseHandler.handleCreateExpense)
	srv.POST("/expenses/monthly", expenseHandler.handleCreateMonthlyExpense)
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
