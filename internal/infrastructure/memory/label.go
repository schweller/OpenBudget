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

func (r *InMemoryLabelRepository) GetByID(ctx context.Context, id uuid.UUID) (entities.Label, error) {
	label, ok := r.data[id]
	if !ok {
		return entities.Label{}, nil
	}
	return label, nil
}

func (r *InMemoryLabelRepository) Create(ctx context.Context, label entities.Label) error {
	r.data[label.ID] = label
	return nil
}

func (r *InMemoryLabelRepository) GetAllLabels(ctx context.Context) ([]entities.Label, error) {
	var labels []entities.Label
	for _, label := range r.data {
		labels = append(labels, label)
	}
	return labels, nil
}
