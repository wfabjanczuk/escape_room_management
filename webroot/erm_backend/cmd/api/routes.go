package main

import (
	"erm_backend/internal/controllers"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) getRoutes() *httprouter.Router {
	router := httprouter.New()

	statusController := controllers.NewStatusController(app.logger, apiName, apiVersion)
	router.HandlerFunc(http.MethodGet, "/", statusController.GetStatus)

	guestController := controllers.NewGuestController(app.logger, app.db)
	router.HandlerFunc(http.MethodGet, "/v1/guests/", guestController.GetGuestCollection)
	router.HandlerFunc(http.MethodGet, "/v1/guests/:id", guestController.GetGuest)

	return router
}
