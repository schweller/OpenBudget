package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/schweller/expenzen/internal/domain/ports"
	"github.com/shopspring/decimal"
)

type ExpenseService struct {
	repo      ports.ExpenseRepository
	labelRepo ports.LabelRepository
}

func NewExpenseService(repo ports.ExpenseRepository, labelRepo ports.LabelRepository) *ExpenseService {
	return &ExpenseService{
		repo:      repo,
		labelRepo: labelRepo,
	}
}

func (c *ExpenseService) GetExpense(ctx context.Context, id uuid.UUID) (entities.Expense, error) {
	out, err := c.repo.GetByID(ctx, id)

	if err != nil {
		return entities.Expense{}, err
	}

	return out, nil
}

func (c *ExpenseService) CreateExpense(ctx context.Context, amount decimal.Decimal, description string, date time.Time) (entities.Expense, error) {
	// Basic validation checks (extend as needed)
	if amount.Cmp(decimal.NewFromInt(0)) <= 0 {
		return entities.Expense{}, errors.New("expense amount must be positive")
	}

	// Create domain object with a new UUID
	e := entities.Expense{
		ID:          uuid.New(),
		Amount:      amount,
		Description: description,
		Date:        date,
	}

	// Persist it using the repository
	if err := c.repo.Create(ctx, e); err != nil {
		return entities.Expense{}, err
	}

	// Return the newly created expense
	return e, nil
}

func (c *ExpenseService) AddLabel(ctx context.Context, expenseID, labelID uuid.UUID) (entities.Expense, error) {
	// Check if the label exists
	_, err := c.labelRepo.GetByID(ctx, labelID)
	if err != nil {
		return entities.Expense{}, err
	}

	return c.repo.AddLabel(ctx, expenseID, labelID)
}

func (c *ExpenseService) RemoveLabel(ctx context.Context, expenseID, labelID uuid.UUID) (entities.Expense, error) {
	_, err := c.labelRepo.GetByID(ctx, labelID)
	if err != nil {
		return entities.Expense{}, err
	}

	return c.repo.RemoveLabel(ctx, expenseID, labelID)
}

func (c *ExpenseService) GetAllExpenses(ctx context.Context) ([]entities.Expense, error) {
	return c.repo.GetAll(ctx)
}
