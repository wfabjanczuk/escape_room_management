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

type reservationController struct {
	controller
	reservationRepository *repositories.ReservationRepository
	roomRepository        *repositories.RoomRepository
}

func newReservationController(logger *log.Logger, reservationRepository *repositories.ReservationRepository, roomRepository *repositories.RoomRepository) *reservationController {
	return &reservationController{
		controller:            newController(logger),
		reservationRepository: reservationRepository,
		roomRepository:        roomRepository,
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

func (c *reservationController) GetReservationTickets(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	tickets, err := c.reservationRepository.GetReservationTickets(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, tickets, "tickets")
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

func (c *reservationController) CreateReservation(w http.ResponseWriter, r *http.Request) {
	c.handleSaveReservation(w, r, false)
}

func (c *reservationController) UpdateReservation(w http.ResponseWriter, r *http.Request) {
	c.handleSaveReservation(w, r, true)
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

func (c *reservationController) handleSaveReservation(w http.ResponseWriter, r *http.Request, parseId bool) {
	reservationErrors := &responses.ReservationErrors{}
	reservation := parsers.ParseReservationFromRequest(r, parseId, reservationErrors)

	if reservationErrors.ErrorsCount == 0 {
		room, err := c.roomRepository.GetRoom(int(reservation.RoomID))
		if err != nil {
			reservationErrors.AddError("", "Room not found.", http.StatusBadRequest)
		}
		reservation.Room = room

		if reservationErrors.ErrorsCount == 0 {
			reservation = c.reservationRepository.SaveReservation(reservation, reservationErrors)
		}
	}

	if reservationErrors.ErrorsCount > 0 {
		err := c.writeWrappedJson(w, reservationErrors.StatusCode, reservationErrors, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, reservation, "reservation")
	if err != nil {
		c.logger.Println(err)
	}
}
