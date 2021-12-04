package controllers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/parsers"
	"erm_backend/internal/payloads"
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
		c.logger.Println(errors.New("invalid id parameter"))
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	var guest models.Guest
	result := c.db.First(&guest, id)
	if result.Error != nil {
		c.writeWrappedErrorJson(w, result.Error, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, guest, "guest")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) GetGuests(w http.ResponseWriter, r *http.Request) {
	var guests []models.Guest
	result := c.db.Order("id asc").Find(&guests)
	if result.Error != nil {
		c.writeWrappedErrorJson(w, result.Error, http.StatusInternalServerError)
		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, guests, "guests")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) CreateGuest(w http.ResponseWriter, r *http.Request) {
	c.handleSaveGuest(w, r, false)
}

func (c *guestController) UpdateGuest(w http.ResponseWriter, r *http.Request) {
	c.handleSaveGuest(w, r, true)
}

func (c *guestController) DeleteGuest(w http.ResponseWriter, r *http.Request) {
	type jsonResp struct {
		OK bool `json:"delete"`
	}

	ok := jsonResp{
		OK: true,
	}

	err := c.writeWrappedJson(w, http.StatusOK, ok, "guest")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) handleSaveGuest(w http.ResponseWriter, r *http.Request, parseId bool) {
	guest, guestErrors := c.saveGuestFromRequest(r, parseId)
	if guestErrors.ErrorsCount > 0 {
		err := c.writeWrappedJson(w, guestErrors.StatusCode, guestErrors, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, guest, "guest")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) saveGuestFromRequest(r *http.Request, parseId bool) (models.Guest, *parsers.GuestErrors) {
	var guestPayload payloads.GuestPayload
	var guest models.Guest
	guestErrors := &parsers.GuestErrors{}

	err := json.NewDecoder(r.Body).Decode(&guestPayload)
	if err != nil {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusBadRequest
		guestErrors.General = append(guestErrors.General, "Invalid form data")

		return guest, guestErrors
	}

	guest, guestErrors = parsers.ParseGuest(guestPayload, parseId, guestErrors)
	if guestErrors.ErrorsCount > 0 {
		return guest, guestErrors
	}

	result := c.db.Save(&guest)
	if result.Error != nil {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusInternalServerError
		guestErrors.General = append(guestErrors.General, "Saving guest data failed")

		return guest, guestErrors
	}

	return guest, guestErrors
}
