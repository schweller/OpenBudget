package memory

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
)

type InMemoryExpenseRepository struct {
	data map[uuid.UUID]entities.Expense
}

func NewInMemoryExpenseRepository() *InMemoryExpenseRepository {
	return &InMemoryExpenseRepository{
		data: make(map[uuid.UUID]entities.Expense),
	}
}

func (r *InMemoryExpenseRepository) GetByID(ctx context.Context, id uuid.UUID) (entities.Expense, error) {
	exp, ok := r.data[id]
	if !ok {
		return entities.Expense{}, fmt.Errorf("expense not found: %s", id)
	}
	return exp, nil
}

func (r *InMemoryExpenseRepository) GetAll(ctx context.Context) ([]entities.Expense, error) {
	// Prepare a slice to hold all expenses.
	all := make([]entities.Expense, 0, len(r.data))
	for _, e := range r.data {
		all = append(all, e)
	}

	return all, nil
}

// Create adds a new Expense to the in-memory map.
func (r *InMemoryExpenseRepository) Create(ctx context.Context, e entities.Expense) error {
	// r.mu.Lock()
	// defer r.mu.Unlock()

	if _, exists := r.data[e.ID]; exists {
		return fmt.Errorf("expense with ID %s already exists", e.ID)
	}

	r.data[e.ID] = e
	return nil
}
