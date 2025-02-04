package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Frequency = int

const (
	// Daily represents a daily frequency
	Daily Frequency = 1
	// Weekly represents a weekly frequency
	Weekly
	// Monthly represents a monthly frequency
	Monthly
)

type Expense struct {
	ID          uuid.UUID
	Amount      decimal.Decimal
	Description string
	Date        time.Time
	Labels      []Label
	Recurrence  *RecurrenceRule // RRULE spec
	IsRollover  bool
}

// Label with budget association
type Label struct {
	ID      uuid.UUID
	Name    string
	Color   string
	Budgets []Budget
}

// Budget with period constraints
type Budget struct {
	ID      uuid.UUID
	LabelID uuid.UUID
	// Amount    decimal.Decimal
	// Period    BudgetPeriod // MONTHLY, QUARTERLY
	StartDate time.Time
	EndDate   *time.Time
}

// Income tracking
type Income struct {
	ID          uuid.UUID
	Amount      decimal.Decimal
	Source      string
	ReceivedAt  time.Time
	Description string
}

type RecurrenceRule struct {
	Frequency Frequency // DAILY, WEEKLY, MONTHLY, YEARLY
	Interval  int
	// ByDay     []Weekday
	Until *time.Time
	Count *int
}
