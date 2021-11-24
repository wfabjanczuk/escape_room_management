package main

import (
	"erm_backend/internal/models"
	"errors"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strconv"
	"time"
)

func (app *application) getGuest(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))

	if err != nil {
		app.logger.Print(errors.New("Invalid id parameter"))
	}

	app.logger.Println("id is", id)

	dateBirth, err := time.Parse("2006-01-02", "1990-01-01")
	if err != nil {
		app.logger.Print(errors.New("Could not parse date"))
	}

	guest := models.Guest{
		Id:          uint(id),
		Email:       "linda.yehudit@gmail.com",
		FirstName:   "Linda",
		LastName:    "Yehudit",
		PhoneNumber: "48100100100",
		DateBirth:   dateBirth,
	}

	err = app.writeJson(w, http.StatusOK, guest, "guest")
}

func (app *application) getGuestCollection(w http.ResponseWriter, r *http.Request) {

}
