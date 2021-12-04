package main

import (
	"erm_backend/internal/controllers"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

const v = "/v1"

func (app *application) getRoutes() http.Handler {
	router := httprouter.New()

	statusController := controllers.NewStatusController(app.logger, apiName, apiVersion)
	router.HandlerFunc(http.MethodGet, "/", statusController.GetStatus)

	guestController := controllers.NewGuestController(app.logger, app.db)
	router.HandlerFunc(http.MethodGet, v+"/guests", guestController.GetGuests)
	router.HandlerFunc(http.MethodPost, v+"/guests", guestController.CreateGuest)
	router.HandlerFunc(http.MethodGet, v+"/guests/:id", guestController.GetGuest)
	router.HandlerFunc(http.MethodPut, v+"/guests/:id", guestController.UpdateGuest)
	router.HandlerFunc(http.MethodDelete, v+"/guests/:id", guestController.DeleteGuest)

	ticketController := controllers.NewTicketController(app.logger, app.db)
	router.HandlerFunc(http.MethodGet, v+"/tickets", ticketController.GetTickets)
	router.HandlerFunc(http.MethodGet, v+"/tickets/:id", ticketController.GetTicket)

	return app.enableCors(router)
}
