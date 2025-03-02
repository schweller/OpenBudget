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

func (c *ExpenseService) CreateExpense(ctx context.Context, amount decimal.Decimal, description string, date time.Time, labels []uuid.UUID) (entities.Expense, error) {
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
		LabelIDs:    labels,
	}

	// Persist it using the repository
	if err := c.repo.Create(ctx, e); err != nil {
		return entities.Expense{}, err
	}

	// Return the newly created expense
	return e, nil
}

func (c *ExpenseService) UpdateExpenses(ctx context.Context, id uuid.UUID, amount decimal.Decimal, description string, date time.Time) (entities.Expense, error) {
	e, err := c.repo.GetByID(ctx, id)

	if err != nil {
		return entities.Expense{}, errors.New("expense doesn't exist")
	}

	e.Amount = amount
	e.Description = description

	updatedEntity, err := c.repo.Update(ctx, e)

	if err != nil {
		return entities.Expense{}, err
	}

	return updatedEntity, nil
}

func (c *ExpenseService) GetMonthlyExpenses(ctx context.Context, year, month int) ([]entities.Expense, error) {
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
