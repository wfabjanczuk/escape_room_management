package controllers

import (
	"erm_backend/internal/models"
	"errors"
	"github.com/julienschmidt/httprouter"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
	"time"
)

type guestController struct {
	controller
	db *gorm.DB
}

func NewGuestController(logger *log.Logger, db *gorm.DB) *guestController {
	return &guestController{
		controller: newController(logger),
		db:         db,
	}
}

func (c *guestController) GetGuest(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))

	if err != nil {
		c.logger.Println(errors.New("Invalid id parameter"))
		c.writeWrappedErrorJson(w, err)
		return
	}

	c.logger.Println("id is", id)

	dateBirth, err := time.Parse("2006-01-02", "1990-01-01")
	if err != nil {
		c.logger.Println(errors.New("Could not parse date"))
	}

	guest := models.Guest{
		Id:          uint(id),
		Email:       "linda.yehudit@gmail.com",
		FirstName:   "Linda",
		LastName:    "Yehudit",
		PhoneNumber: "48100100100",
		DateBirth:   dateBirth,
	}

	err = c.writeWrappedJson(w, http.StatusOK, guest, "guest")
}

func (c *guestController) GetGuestCollection(w http.ResponseWriter, r *http.Request) {

}
