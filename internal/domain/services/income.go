package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/schweller/expenzen/internal/domain/ports"
	"github.com/shopspring/decimal"
	"github.com/teambition/rrule-go"
)

type IncomeService struct {
	repo ports.IncomeRepository
}

func NewIncomeService(repo ports.IncomeRepository) *IncomeService {
	return &IncomeService{
		repo: repo,
	}
}

func (c *IncomeService) CreateIncome(ctx context.Context, amount decimal.Decimal, name string) (entities.Income, error) {
	r, _ := rrule.NewRRule(rrule.ROption{
		Freq:    rrule.MONTHLY,
		Dtstart: time.Now(),
		Count:   120,
	})

	for _, t := range r.All() {
		i := entities.Income{
			ID:          uuid.New(),
			Amount:      amount,
			Date:        t,
			Description: name,
		}
		c.repo.Create(ctx, i)
	}

	return entities.Income{}, nil
}

func (c *IncomeService) GetAllIncomes(ctx context.Context) ([]entities.Income, error) {
	return c.repo.GetAll(ctx)
}

func (c *IncomeService) GetMonthlyIncomes(ctx context.Context, year, month int) ([]entities.Income, error) {
	// Basic validation checks (extend as needed)
	if year < 0 || month < 1 || month > 12 {
		return nil, errors.New("invalid year or month")
	}

	println("Fetching expenses for", year, month)

	// Get the first and last day of the month
	start := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0).Add(-time.Nanosecond)

	// Fetch expenses for the given period
	return c.repo.GetByPeriod(ctx, start, end)
}
