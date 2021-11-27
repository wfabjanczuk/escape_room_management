package controllers

import (
	"erm_backend/internal/models"
	"errors"
	"github.com/julienschmidt/httprouter"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
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

	var guest models.Guest
	result := c.db.First(&guest, id)
	if result.Error != nil {
		c.writeWrappedErrorJson(w, result.Error)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, guest, "guest")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) GetGuestCollection(w http.ResponseWriter, r *http.Request) {
	var guests []models.Guest
	result := c.db.Find(&guests)
	if result.Error != nil {
		c.writeWrappedErrorJson(w, result.Error)
		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, guests, "guests")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) CreateGuest(w http.ResponseWriter, r *http.Request) {

}

func (c *guestController) UpdateGuest(w http.ResponseWriter, r *http.Request) {

}

func (c *guestController) DeleteGuest(w http.ResponseWriter, r *http.Request) {

}