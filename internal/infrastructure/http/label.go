package http

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/schweller/expenzen/internal/domain/services"
)

type LabelHandler struct {
	svc *services.LabelService
}

func NewLabelHandler(s *services.LabelService) *LabelHandler {
	return &LabelHandler{s}
}

func (h *LabelHandler) handleCreateLabel(c echo.Context) error {
	payload := struct {
		Name string `json:"name"`
	}{}

	err := c.Bind(&payload)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	exp, err := h.svc.CreateLabel(c.Request().Context(), payload.Name)

	if err != nil {
		return err
	}

	fmt.Println("New label created:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}

func (h *LabelHandler) handleGetLabels(c echo.Context) error {

	payload := struct {
		StartDate time.Time `query:"startDate"`
		EndDate   time.Time `query:"endDate"`
	}{}

	err := c.Bind(&payload)

	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	lab, err := h.svc.GetLabelsByPeriod(c.Request().Context(), payload.StartDate, payload.EndDate)

	fmt.Println("All labels fetched:", lab)

	if err != nil {
		return err
	}

	if len(lab) == 0 {
		fmt.Println("Warning: returning empty list")
		// Consider returning an empty array instead of null
		return c.JSON(http.StatusOK, okResp{[]entities.Label{}})
	}

	return c.JSON(http.StatusOK, okResp{lab})
}
