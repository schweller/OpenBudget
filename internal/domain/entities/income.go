package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Income struct {
	ID          uuid.UUID       `json:"id"`
	Amount      decimal.Decimal `json:"amount"`
	Source      string          `json:"source"`
	Date        time.Time       `json:"date"`
	Recurrence  RecurrenceRule
	Description string `json:"description"`
}
