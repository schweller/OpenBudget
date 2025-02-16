package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	services "github.com/schweller/expenzen/internal/domain/services"
	handlers "github.com/schweller/expenzen/internal/infrastructure/http"
)

func initSrv(container *services.Container) *echo.Echo {
	var srv = echo.New()

	srv.Use(middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {}))
	handlers.InitHTTPHandlers(srv, container)

	srv.Logger.Fatal(srv.Start(":1323"))
	return srv
}

func main() {
	// Later initialize DB
	container := services.NewContainer()

	// expense, err := container.ExpenseService.CreateExpense(ctx, decimal.NewFromFloat(42.50), "Groceries", time.Now())
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("New expense created:", expense)

	// fetched, err := container.ExpenseService.GetExpense(ctx, expense.ID)
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Printf("Fetched expense: %+v\n", fetched)

	// // Create a couple of expenses
	// _, _ = container.ExpenseService.CreateExpense(ctx, decimal.NewFromFloat(10.00), "Coffee", time.Now())
	// _, _ = container.ExpenseService.CreateExpense(ctx, decimal.NewFromFloat(20.00), "Groceries", time.Now())

	// expenses, err := container.ExpenseService.GetAllExpenses(ctx)
	// if err != nil {
	// 	panic(err)
	// }

	// fmt.Println("All expenses:")
	// for _, e := range expenses {
	// 	fmt.Printf(" - %s: %s - Amount: %s - Date: %s\n", e.ID, e.Description, e.Amount, e.Date)
	// }

	initSrv(container)
}
