package entities

import "github.com/google/uuid"

// Label with budget association
type Label struct {
	ID      uuid.UUID
	Name    string
	Color   string
	Budgets []Budget
}
