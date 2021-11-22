package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) getRoutes() *httprouter.Router {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	return router
}
