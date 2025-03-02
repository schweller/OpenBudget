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

type DTO struct {
	Amount float64 `json:"amount"`
	Name   string  `json:"name"`
	Date   string  `json:"date,omitempty"`
}

func (h *ExpenseHandler) handleCreateExpense(c echo.Context) error {
	var payload DTO

	fmt.Println("Request body:", c.Request().Body)
	err := c.Bind(&payload)
	fmt.Println("Payload:", payload.Amount, payload.Name)

	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	var date time.Time
	if payload.Date != "" {
		date, err = time.Parse(time.RFC3339, payload.Date)
		if err != nil {
			return c.String(http.StatusBadRequest, "invalid date format")
		}
	} else {
		date = time.Now()
	}

	exp, err := h.svc.CreateExpense(c.Request().Context(), decimal.NewFromFloat(payload.Amount), payload.Name, date)

	if err != nil {
		return err
	}

	fmt.Println("New expense created:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}

func (h *ExpenseHandler) handleUpdateExpense(c echo.Context) error {
	payload := struct {
		ID     uuid.UUID `param:"id"`
		Amount float64   `json:"amount"`
		Name   string    `json:"name"`
	}{}

	fmt.Println("Request body:", c.Request().Body)
	err := c.Bind(&payload)
	fmt.Println("Payload:", payload.Amount, payload.Name)

	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	exp, err := h.svc.UpdateExpenses(c.Request().Context(), payload.ID, decimal.NewFromFloat(payload.Amount), payload.Name, time.Now())

	if err != nil {
		return err
	}

	fmt.Println("Expense Updated:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}

func (h *ExpenseHandler) handleGetMonthlyExpenses(c echo.Context) error {
	// year, month := {year}, {month}
	payload := struct {
		Year  int `param:"year"`
		Month int `param:"month"`
	}{}
	err := c.Bind(&payload)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	expenses, err := h.svc.GetMonthlyExpenses(c.Request().Context(), payload.Year, payload.Month)

	if err != nil {
		return err
	}

	fmt.Println("Monthly expenses fetched:", expenses)

	return c.JSON(http.StatusOK, okResp{expenses})
}

func (h *ExpenseHandler) handleGetAllExpenses(c echo.Context) error {
	expenses, err := h.svc.GetAllExpenses(c.Request().Context())

	if err != nil {
		c.String(http.StatusInternalServerError, "error fetching expenses")
	}

	fmt.Println("All expenses fetched:", expenses)

	return c.JSON(http.StatusOK, okResp{expenses})
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
