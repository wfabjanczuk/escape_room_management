package controllers

import (
	"erm_backend/internal/repositories"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strconv"
)

type reservationController struct {
	controller
	reservationRepository *repositories.ReservationRepository
}

func NewReservationController(logger *log.Logger, reservationRepository *repositories.ReservationRepository) *reservationController {
	return &reservationController{
		controller:            newController(logger),
		reservationRepository: reservationRepository,
	}
}

func (c *reservationController) GetReservation(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	reservation, err := c.reservationRepository.GetReservation(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, reservation, "reservation")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *reservationController) GetReservations(w http.ResponseWriter, r *http.Request) {
	reservations, err := c.reservationRepository.GetReservations()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, reservations, "reservations")
	if err != nil {
		c.logger.Println(err)
	}
}
