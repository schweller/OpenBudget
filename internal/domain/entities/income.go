package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Income struct {
	ID          uuid.UUID
	Amount      decimal.Decimal
	Source      string
	Date        time.Time
	Recurrence  RecurrenceRule
	Description string
}
