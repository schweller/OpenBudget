package http

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
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
		StartDate time.Time `json:"start_date"`
		EndDate   time.Time `json:"end_date"`
	}{}

	err := c.Bind(&payload)

	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	lab, err := h.svc.GetLabelsByPeriod(c.Request().Context(), payload.StartDate, payload.EndDate)

	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, okResp{lab})
}
