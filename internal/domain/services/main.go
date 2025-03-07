package services

import "github.com/schweller/expenzen/internal/infrastructure/memory"

type Container struct {
	ExpenseService      *ExpenseService
	LabelService        *LabelService
	IncomeService       *IncomeService
	ExpenseGroupService *ExpenseGroupService
}

func NewContainer() *Container {
	// Create repositories
	labelRepo := memory.NewInMemoryLabelRepo()
	expenseRepo := memory.NewInMemoryExpenseRepository()
	incomeRepo := memory.NewInMemoryIncomeRepository()
	expenseGroupRepo := memory.NewInMemoryExpenseGroupRepository()

	// Create services
	labelService := NewLabelService(labelRepo, expenseRepo)
	expenseService := NewExpenseService(expenseRepo, labelRepo, expenseGroupRepo)
	incomeService := NewIncomeService(incomeRepo)
	expenseGroupService := NewExpenseGroupService(expenseRepo, expenseGroupRepo)

	// Create container
	return &Container{
		ExpenseService:      expenseService,
		LabelService:        labelService,
		IncomeService:       incomeService,
		ExpenseGroupService: expenseGroupService,
	}
}
