package http

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/schweller/expenzen/internal/domain/services"
	"github.com/shopspring/decimal"
)

type IncomeHandler struct {
	svc *services.IncomeService
}

func NewIncomeHandler(s *services.IncomeService) *IncomeHandler {
	return &IncomeHandler{s}
}

func (h *IncomeHandler) handleGetAllIncomes(c echo.Context) error {
	incomes, err := h.svc.GetAllIncomes(c.Request().Context())

	if err != nil {
		c.String(http.StatusInternalServerError, "error fetching incomes")
	}

	fmt.Println("All incomes fetched:", incomes)

	return c.JSON(http.StatusOK, okResp{incomes})
}

func (h *IncomeHandler) handleCreateIncome(c echo.Context) error {
	payload := struct {
		Amount float64 `json:"amount"`
		Name   string  `json:"name"`
	}{}
	fmt.Println("Request body:", c.Request().Body)
	err := c.Bind(&payload)
	fmt.Println("Payload:", payload.Amount, payload.Name)

	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	incomes, err := h.svc.CreateIncome(c.Request().Context(), decimal.NewFromFloat(payload.Amount))

	if err != nil {
		c.String(http.StatusInternalServerError, "error creating income group")
	}

	return c.JSON(http.StatusOK, okResp{incomes})
}

func (h *IncomeHandler) handleGetMonthlyIncomes(c echo.Context) error {
	// year, month := {year}, {month}
	payload := struct {
		Year  int `param:"year"`
		Month int `param:"month"`
	}{}
	err := c.Bind(&payload)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	expenses, err := h.svc.GetMonthlyIncomes(c.Request().Context(), payload.Year, payload.Month)

	if err != nil {
		return err
	}

	fmt.Println("Monthly expenses fetched:", expenses)

	return c.JSON(http.StatusOK, okResp{expenses})
}
