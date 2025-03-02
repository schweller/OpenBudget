package entities

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Label with budget association
type Label struct {
	ID            uuid.UUID       `json:"id"`
	Name          string          `json:"name"`
	TotalExpenses decimal.Decimal `json:"totalExpenses,omitempty"`
}
