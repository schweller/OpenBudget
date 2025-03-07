package memory

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
)

type InMemoryExpenseGroupRepository struct {
	data map[uuid.UUID]entities.ExpenseGroup
}

func NewInMemoryExpenseGroupRepository() *InMemoryExpenseGroupRepository {
	return &InMemoryExpenseGroupRepository{
		data: make(map[uuid.UUID]entities.ExpenseGroup),
	}
}

func (r *InMemoryExpenseGroupRepository) Create(ctx context.Context, expenseGroup entities.ExpenseGroup) error {
	if _, exists := r.data[expenseGroup.ID]; exists {
		return fmt.Errorf("expense group with ID %s already exists", expenseGroup.ID)
	}
	r.data[expenseGroup.ID] = expenseGroup
	return nil
}
