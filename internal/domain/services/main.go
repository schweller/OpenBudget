package services

import "github.com/schweller/expenzen/internal/infrastructure/memory"

type Container struct {
	ExpenseService *ExpenseService
	LabelService   *LabelService
	IncomeService  *IncomeService
}

func NewContainer() *Container {
	// Create repositories
	labelRepo := memory.NewInMemoryLabelRepo()
	expenseRepo := memory.NewInMemoryExpenseRepository()
	incomeRepo := memory.NewInMemoryIncomeRepository()

	// Create services
	labelService := NewLabelService(labelRepo)
	expenseService := NewExpenseService(expenseRepo, labelRepo)
	incomeService := NewIncomeService(incomeRepo)

	// Create container
	return &Container{
		ExpenseService: expenseService,
		LabelService:   labelService,
		IncomeService:  incomeService,
	}
}
