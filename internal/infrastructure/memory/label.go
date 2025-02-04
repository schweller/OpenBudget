package memory

import (
	"context"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
)

type InMemoryLabelRepository struct {
	data map[uuid.UUID]entities.Label
}

func NewInMemoryLabelRepo() *InMemoryLabelRepository {
	return &InMemoryLabelRepository{
		data: make(map[uuid.UUID]entities.Label),
	}
}

func (r *InMemoryLabelRepository) Create(ctx context.Context, label entities.Label) error {
	r.data[label.ID] = label
	return nil
}
