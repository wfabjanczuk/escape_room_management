package controllers

import (
	"erm_backend/internal/parsers"
	"erm_backend/internal/repositories"
	"erm_backend/internal/responses"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strconv"
)

type guestController struct {
	controller
	guestRepository *repositories.GuestRepository
}

func NewGuestController(logger *log.Logger, guestRepository *repositories.GuestRepository) *guestController {
	return &guestController{
		controller:      newController(logger),
		guestRepository: guestRepository,
	}
}

func (c *guestController) GetGuest(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	guest, err := c.guestRepository.GetGuest(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, guest, "guest")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *guestController) GetGuests(w http.ResponseWriter, r *http.Request) {
	guests, err := c.guestRepository.GetGuests()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, guests, "guests")
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
	guestDeleteError := &responses.GuestDeleteError{}
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	c.guestRepository.DeleteGuest(id, guestDeleteError)
	if guestDeleteError.ErrorsCount > 0 {
		err = c.writeWrappedJson(w, guestDeleteError.StatusCode, guestDeleteError, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	c.writeEmptyResponse(w, http.StatusOK)
}

func (c *guestController) handleSaveGuest(w http.ResponseWriter, r *http.Request, parseId bool) {
	guestErrors := &responses.GuestErrors{}
	guest := parsers.ParseGuestFromRequest(r, parseId, guestErrors)

	if guestErrors.ErrorsCount == 0 {
		c.guestRepository.SaveGuest(guest, guestErrors)
	}

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
