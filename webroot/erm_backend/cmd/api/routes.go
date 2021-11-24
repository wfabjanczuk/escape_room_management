package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) getRoutes() *httprouter.Router {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	router.HandlerFunc(http.MethodGet, "/v1/guests/", app.getGuestCollection)
	router.HandlerFunc(http.MethodGet, "/v1/guests/:id", app.getGuest)

	return router
}
