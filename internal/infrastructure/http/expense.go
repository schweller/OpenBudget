package http

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	services "github.com/schweller/expenzen/internal/domain/services"
	"github.com/shopspring/decimal"
)

type ExpenseHandler struct {
	svc *services.ExpenseService
}

func NewExpenseHandler(s *services.ExpenseService) *ExpenseHandler {
	return &ExpenseHandler{s}
}

func (h *ExpenseHandler) handleCreateExpense(c echo.Context) error {

	exp, err := h.svc.CreateExpense(c.Request().Context(), decimal.NewFromFloat(42.50), "Groceries", time.Now())

	if err != nil {
		return err
	}

	fmt.Println("New expense created:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}
