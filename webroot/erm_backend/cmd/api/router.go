package main

import (
	"erm_backend/internal/controllers"
	"erm_backend/internal/repositories"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

const v = "/v1"

func (app *application) getRouter() http.Handler {
	router := httprouter.New()

	app.setStatusRoutes(router)
	app.setGuestRoutes(router)
	app.setTicketRoutes(router)
	app.setReservationRoutes(router)
	app.setRoomRoutes(router)

	return app.enableCors(router)
}

func (app *application) setStatusRoutes(router *httprouter.Router) *httprouter.Router {
	statusController := controllers.NewStatusController(app.logger, apiName, apiVersion)
	router.HandlerFunc(http.MethodGet, "/", statusController.GetStatus)

	return router
}

func (app *application) setGuestRoutes(router *httprouter.Router) *httprouter.Router {
	guestController := controllers.NewGuestController(app.logger,
		repositories.NewGuestRepository(app.logger, app.db),
	)
	router.HandlerFunc(http.MethodGet, v+"/guests", guestController.GetGuests)
	router.HandlerFunc(http.MethodPost, v+"/guests", guestController.CreateGuest)
	router.HandlerFunc(http.MethodGet, v+"/guests/:id", guestController.GetGuest)
	router.HandlerFunc(http.MethodPut, v+"/guests/:id", guestController.UpdateGuest)
	router.HandlerFunc(http.MethodDelete, v+"/guests/:id", guestController.DeleteGuest)
	router.HandlerFunc(http.MethodGet, v+"/guests/:id/tickets", guestController.GetGuestTickets)

	return router
}

func (app *application) setTicketRoutes(router *httprouter.Router) *httprouter.Router {
	ticketController := controllers.NewTicketController(app.logger,
		repositories.NewTicketRepository(app.logger, app.db),
		repositories.NewReservationRepository(app.logger, app.db),
		repositories.NewGuestRepository(app.logger, app.db),
	)
	router.HandlerFunc(http.MethodGet, v+"/tickets", ticketController.GetTickets)
	router.HandlerFunc(http.MethodPost, v+"/tickets", ticketController.CreateTicket)
	router.HandlerFunc(http.MethodGet, v+"/tickets/:id", ticketController.GetTicket)
	router.HandlerFunc(http.MethodPut, v+"/tickets/:id", ticketController.UpdateTicket)
	router.HandlerFunc(http.MethodDelete, v+"/tickets/:id", ticketController.DeleteTicket)

	return router
}

func (app *application) setReservationRoutes(router *httprouter.Router) *httprouter.Router {
	reservationController := controllers.NewReservationController(app.logger,
		repositories.NewReservationRepository(app.logger, app.db),
		repositories.NewRoomRepository(app.logger, app.db),
	)
	router.HandlerFunc(http.MethodGet, v+"/reservations", reservationController.GetReservations)
	router.HandlerFunc(http.MethodPost, v+"/reservations", reservationController.CreateReservation)
	router.HandlerFunc(http.MethodGet, v+"/reservations/:id", reservationController.GetReservation)
	router.HandlerFunc(http.MethodPut, v+"/reservations/:id", reservationController.UpdateReservation)
	router.HandlerFunc(http.MethodDelete, v+"/reservations/:id", reservationController.DeleteReservation)
	router.HandlerFunc(http.MethodGet, v+"/reservations/:id/tickets", reservationController.GetReservationTickets)

	return router
}

func (app *application) setRoomRoutes(router *httprouter.Router) *httprouter.Router {
	roomController := controllers.NewRoomController(app.logger,
		repositories.NewRoomRepository(app.logger, app.db),
	)
	router.HandlerFunc(http.MethodGet, v+"/rooms", roomController.GetRooms)
	router.HandlerFunc(http.MethodGet, v+"/rooms/:id", roomController.GetRoom)
	router.HandlerFunc(http.MethodDelete, v+"/rooms/:id", roomController.DeleteRoom)
	router.HandlerFunc(http.MethodGet, v+"/rooms/:id/reservations", roomController.GetRoomReservations)

	return router
}
