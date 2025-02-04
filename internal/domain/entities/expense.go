package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Expense struct {
	ID          uuid.UUID
	Amount      decimal.Decimal
	Description string
	Date        time.Time
	Recurrence  RecurrenceRule
	IsRollover  bool
	LabelIDs    []uuid.UUID
}

type RecurrenceRule struct {
	Frequency Frequency
	Interval  int
	ByDay     []time.Weekday
	Until     *time.Time
}

type Frequency int

const (
	FrequencyDaily Frequency = iota
	FrequencyWeekly
	FrequencyMonthly
	FrequencyYearly
)
