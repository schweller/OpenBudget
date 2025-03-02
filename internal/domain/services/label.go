package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/schweller/expenzen/internal/domain/ports"
	"github.com/shopspring/decimal"
)

type LabelService struct {
	repo        ports.LabelRepository
	expenseRepo ports.ExpenseRepository
}

func NewLabelService(repo ports.LabelRepository, expenseRepo ports.ExpenseRepository) *LabelService {
	return &LabelService{repo: repo, expenseRepo: expenseRepo}
}

func (c *LabelService) GetLabelByID(id string) (string, error) {
	return "", nil
}

func (c *LabelService) GetLabelsByPeriod(ctx context.Context, start, end time.Time) ([]entities.Label, error) {
	labels, err := c.repo.GetAllLabels(ctx)
	if err != nil {
		return nil, err
	}

	for i, label := range labels {
		expenses, err := c.expenseRepo.GetExpensesByLabelAndPeriod(ctx, label.ID, start, end)
		if err != nil {
			return nil, err
		}

		var totalSum decimal.Decimal
		for _, expense := range expenses {
			totalSum = totalSum.Add(expense.Amount)
		}

		labels[i].TotalExpenses = totalSum
	}

	return labels, nil
}

func (c *LabelService) CreateLabel(ctx context.Context, name string) (entities.Label, error) {
	l := entities.Label{
		ID:    uuid.New(),
		Name:  name,
		Color: "#000000",
	}

	if err := c.repo.Create(ctx, l); err != nil {
		return entities.Label{}, err
	}

	return l, nil
}
