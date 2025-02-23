package ports

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/shopspring/decimal"
)

type ExpenseRepository interface {
	Create(ctx context.Context, expense entities.Expense) error
	GetByID(ctx context.Context, id uuid.UUID) (entities.Expense, error)
	GetAll(ctx context.Context) ([]entities.Expense, error)
	GetByPeriod(ctx context.Context, start, end time.Time) ([]entities.Expense, error)
	// GetRollovers(ctx context.Context) ([]entities.Expense, error)
	AddLabel(ctx context.Context, expenseID, labelID uuid.UUID) (entities.Expense, error)
	RemoveLabel(ctx context.Context, expenseID, labelID uuid.UUID) (entities.Expense, error)
	Update(ctx context.Context, expense entities.Expense) (entities.Expense, error)
}

type BudgetRepository interface {
	SetBudget(ctx context.Context, labelID uuid.UUID, amount decimal.Decimal, period entities.BudgetPeriod) error
	GetCurrentBudget(ctx context.Context, labelID uuid.UUID) (decimal.Decimal, error)
	GetHistoricalBudgets(ctx context.Context, labelID uuid.UUID) ([]entities.Budget, error)
}

type LabelRepository interface {
	Create(ctx context.Context, label entities.Label) error
	GetByID(ctx context.Context, id uuid.UUID) (entities.Label, error)
	// AssociateWithExpense(ctx context.Context, labelID, expenseID uuid.UUID) error
	// ListAll(ctx context.Context) ([]entities.Label, error)
}

type IncomeRepository interface {
	Create(ctx context.Context, income entities.Income) error
	Update(ctx context.Context, income entities.Income) error
}
