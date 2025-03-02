package memory

import (
	"context"
	"fmt"
	"time"

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

func (r *InMemoryExpenseRepository) GetByPeriod(ctx context.Context, start, end time.Time) ([]entities.Expense, error) {
	results := make([]entities.Expense, 0)

	for _, e := range r.data {
		if e.Date.After(start) && e.Date.Before(end) {
			results = append(results, e)
		}
	}

	return results, nil
}

func (r *InMemoryExpenseRepository) GetExpensesByLabelAndPeriod(ctx context.Context, labelID uuid.UUID, start, end time.Time) ([]entities.Expense, error) {
	results := make([]entities.Expense, 0)

	for _, e := range r.data {
		if e.Date.After(start) && e.Date.Before(end) {
			for _, id := range e.LabelIDs {
				if id == labelID {
					results = append(results, e)
					break
				}
			}
		}
	}

	return results, nil
}

func (r *InMemoryExpenseRepository) AddLabel(ctx context.Context, expenseID, labelID uuid.UUID) (entities.Expense, error) {
	exp, ok := r.data[expenseID]
	if !ok {
		return entities.Expense{}, fmt.Errorf("expense not found: %s", expenseID)
	}

	exp.LabelIDs = append(exp.LabelIDs, labelID)
	r.data[expenseID] = exp
	return exp, nil
}

func (r *InMemoryExpenseRepository) RemoveLabel(ctx context.Context, expenseID, labelID uuid.UUID) (entities.Expense, error) {
	exp, ok := r.data[expenseID]
	if !ok {
		return entities.Expense{}, fmt.Errorf("expense not found: %s", expenseID)
	}

	// Find the label in the slice and remove it.
	for i, id := range exp.LabelIDs {
		if id == labelID {
			exp.LabelIDs = append(exp.LabelIDs[:i], exp.LabelIDs[i+1:]...)
			r.data[expenseID] = exp
			return exp, nil
		}
	}

	return entities.Expense{}, fmt.Errorf("label not found on expense: %s", labelID)
}

func (r *InMemoryExpenseRepository) Update(ctx context.Context, e entities.Expense) (entities.Expense, error) {
	// Check if the expense exists
	_, ok := r.data[e.ID]
	if !ok {
		return entities.Expense{}, fmt.Errorf("expense not found: %s", e.ID)
	}

	r.data[e.ID] = e
	return e, nil
}
