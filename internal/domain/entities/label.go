package entities

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Label with budget association
type Label struct {
	ID            uuid.UUID
	Name          string
	Color         string
	TotalExpenses decimal.Decimal

	Budgets []Budget
}
