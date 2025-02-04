package http

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
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

type TestDTO struct {
	LabelID   uuid.UUID `param:"label_id"`
	ExpenseID uuid.UUID `param:"expense_id"`
}

func (h *ExpenseHandler) handleAddLabel(c echo.Context) error {
	var testDTO TestDTO
	err := c.Bind(&testDTO)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	exp, err := h.svc.AddLabel(c.Request().Context(), testDTO.ExpenseID, testDTO.LabelID)

	if err != nil {
		return err
	}

	fmt.Println("Label added to expense:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}
