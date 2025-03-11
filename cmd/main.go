package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	services "github.com/schweller/openbudget/internal/domain/services"
	handlers "github.com/schweller/openbudget/internal/infrastructure/http"
)

func initSrv(container *services.Container) *echo.Echo {
	var srv = echo.New()

	srv.Use(middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {}))
	srv.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Access-Control-Allow-Origin", "*")
			c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Response().Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if c.Request().Method == "OPTIONS" {
				return c.NoContent(204)
			}
			return next(c)
		}
	})
	handlers.InitHTTPHandlers(srv, container)

	srv.Logger.Fatal(srv.Start(":1323"))
	return srv
}

func main() {
	container := services.NewContainer()
	initSrv(container)
}
