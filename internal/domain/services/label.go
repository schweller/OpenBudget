package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/schweller/expenzen/internal/domain/ports"
)

type LabelService struct {
	repo ports.LabelRepository
}

func NewLabelService(repo ports.LabelRepository) *LabelService {
	return &LabelService{repo: repo}
}

func (c *LabelService) GetLabelByID(id string) (string, error) {
	return "", nil
}

func (c *LabelService) CreateLabel(ctx context.Context) (entities.Label, error) {
	l := entities.Label{
		ID:    uuid.New(),
		Name:  "Test",
		Color: "#000000",
	}

	if err := c.repo.Create(ctx, l); err != nil {
		return entities.Label{}, err
	}

	return l, nil
}
