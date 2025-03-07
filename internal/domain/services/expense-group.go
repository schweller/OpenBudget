package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/schweller/expenzen/internal/domain/entities"
	"github.com/schweller/expenzen/internal/domain/ports"
)

type ExpenseGroupService struct {
	expenserepo  ports.ExpenseRepository
	expenseGroup ports.ExpenseGroupRepository
}

func NewExpenseGroupService(expenserepo ports.ExpenseRepository, expenseGroup ports.ExpenseGroupRepository) *ExpenseGroupService {
	return &ExpenseGroupService{
		expenserepo:  expenserepo,
		expenseGroup: expenseGroup,
	}
}

func (s *ExpenseGroupService) CreateExpenseGroup(ctx context.Context) (entities.ExpenseGroup, error) {
	expenseGroup := entities.ExpenseGroup{
		ID: uuid.New(),
	}

	err := s.expenseGroup.Create(ctx, expenseGroup)
	if err != nil {
		return entities.ExpenseGroup{}, err
	}

	return expenseGroup, nil
}
