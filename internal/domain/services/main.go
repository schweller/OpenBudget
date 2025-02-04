package services

import "github.com/schweller/expenzen/internal/infrastructure/memory"

type Container struct {
	ExpenseService *ExpenseService
	LabelService   *LabelService
}

func NewContainer() *Container {
	// Create repositories
	labelRepo := memory.NewInMemoryLabelRepo()
	expenseRepo := memory.NewInMemoryExpenseRepository()

	// Create services
	labelService := NewLabelService(labelRepo)
	expenseService := NewExpenseService(expenseRepo, labelRepo)

	// Create container
	return &Container{
		ExpenseService: expenseService,
		LabelService:   labelService,
	}
}
