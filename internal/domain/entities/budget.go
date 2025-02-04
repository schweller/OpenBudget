package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type BudgetPeriod int

const (
	BudgetMonthly BudgetPeriod = iota
	BudgetQuarterly
	BudgetYearly
)

type Budget struct {
	ID        uuid.UUID
	LabelID   uuid.UUID
	Amount    decimal.Decimal
	Period    BudgetPeriod
	StartDate time.Time
	EndDate   *time.Time
}
