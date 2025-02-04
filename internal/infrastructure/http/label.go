package http

import (
	"fmt"
	"net/http"

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
	exp, err := h.svc.CreateLabel(c.Request().Context())

	if err != nil {
		return err
	}

	fmt.Println("New label created:", exp)

	return c.JSON(http.StatusOK, okResp{exp})
}
