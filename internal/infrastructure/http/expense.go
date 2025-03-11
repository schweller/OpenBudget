package http

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/schweller/openbudget/internal/domain/entities"
	services "github.com/schweller/openbudget/internal/domain/services"
	"github.com/shopspring/decimal"
)

type ExpenseHandler struct {
	svc   *services.ExpenseService
	egSvc *services.ExpenseGroupService
}

func NewExpenseHandler(s *services.ExpenseService, e *services.ExpenseGroupService) *ExpenseHandler {
	return &ExpenseHandler{
		svc:   s,
		egSvc: e,
	}
}

type CreateExpenseDTO struct {
	Amount float64          `json:"amount"`
	Name   string           `json:"name"`
	Date   string           `json:"date,omitempty"`
	Labels []entities.Label `json:"labels,omitempty"`
}

func (h *ExpenseHandler) handleCreateExpense(c echo.Context) error {
	var payload CreateExpenseDTO

	fmt.Println("Request body:", c.Request().Body)
	err := c.Bind(&payload)
	fmt.Println("Payload:", payload.Amount, payload.Name, payload.Labels)

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

	var labelIDs []uuid.UUID
	for _, label := range payload.Labels {
		labelIDs = append(labelIDs, label.ID)
	}

	exp, err := h.svc.CreateExpense(c.Request().Context(), decimal.NewFromFloat(payload.Amount), payload.Name, date, labelIDs)

	if err != nil {
		return err
	}

	fmt.Println("New expense created:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}

func (h *ExpenseHandler) handleUpdateExpense(c echo.Context) error {
	payload := struct {
		ID     uuid.UUID        `param:"id"`
		Amount float64          `json:"amount"`
		Name   string           `json:"name"`
		Date   string           `json:"date,omitempty"`
		Labels []entities.Label `json:"labels,omitempty"`
	}{}

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

	var labelIDs []uuid.UUID
	for _, label := range payload.Labels {
		labelIDs = append(labelIDs, label.ID)
	}

	exp, err := h.svc.UpdateExpenses(c.Request().Context(), payload.ID, decimal.NewFromFloat(payload.Amount), payload.Name, date, labelIDs)

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

func (h *ExpenseHandler) handleGetExpenseById(c echo.Context) error {
	id := c.Param("id")
	expenseID, err := uuid.Parse(id)
	if err != nil {
		return c.String(http.StatusBadRequest, "invalid expense ID format")
	}

	expense, err := h.svc.GetExpenseById(c.Request().Context(), expenseID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "error fetching expense")
	}

	fmt.Println("Expense fetched:", expense)

	return c.JSON(http.StatusOK, okResp{expense})
}

func (h *ExpenseHandler) handleCreateMonthlyExpense(c echo.Context) error {
	var payload CreateExpenseDTO

	fmt.Println("Request body:", c.Request().Body)
	err := c.Bind(&payload)

	if err != nil {
		fmt.Println(err)
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

	var labelIDs []uuid.UUID
	for _, label := range payload.Labels {
		labelIDs = append(labelIDs, label.ID)
	}

	expenseGroup, err := h.egSvc.CreateExpenseGroup(c.Request().Context())
	if err != nil {
		return c.String(http.StatusInternalServerError, "error creating expense group")
	}

	exp, err := h.svc.CreateRecurrentExpense(c.Request().Context(), decimal.NewFromFloat(payload.Amount), payload.Name, date, labelIDs, expenseGroup)
	if err != nil {
		return c.String(http.StatusInternalServerError, "error creating expense")
	}

	fmt.Println("New monthly expense created:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}
