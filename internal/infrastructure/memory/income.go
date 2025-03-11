package memory

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/schweller/openbudget/internal/domain/entities"
)

type InMemoryIncomeRepository struct {
	data map[uuid.UUID]entities.Income
}

func NewInMemoryIncomeRepository() *InMemoryIncomeRepository {
	return &InMemoryIncomeRepository{
		data: make(map[uuid.UUID]entities.Income),
	}
}

func (r *InMemoryIncomeRepository) GetAll(ctx context.Context) ([]entities.Income, error) {
	// Prepare a slice to hold all incomes.
	all := make([]entities.Income, 0, len(r.data))
	for _, i := range r.data {
		all = append(all, i)
	}

	return all, nil
}

func (r *InMemoryIncomeRepository) Create(ctx context.Context, i entities.Income) error {
	if _, exists := r.data[i.ID]; exists {
		return fmt.Errorf("income with ID %s already exists", i.ID)
	}

	r.data[i.ID] = i
	return nil
}

func (r *InMemoryIncomeRepository) GetByPeriod(ctx context.Context, start, end time.Time) ([]entities.Income, error) {
	results := make([]entities.Income, 0)

	for _, e := range r.data {
		if e.Date.After(start) && e.Date.Before(end) {
			results = append(results, e)
		}
	}

	return results, nil
}
