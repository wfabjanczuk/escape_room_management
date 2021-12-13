package controllers

import (
	"erm_backend/internal/repositories"
	"erm_backend/internal/responses"
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

func (c *reservationController) DeleteReservation(w http.ResponseWriter, r *http.Request) {
	deleteError := &responses.DeleteError{}
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	c.reservationRepository.DeleteReservation(id, deleteError)
	if deleteError.ErrorsCount > 0 {
		err = c.writeWrappedJson(w, deleteError.StatusCode, deleteError, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	c.writeEmptyResponse(w, http.StatusOK)
}
