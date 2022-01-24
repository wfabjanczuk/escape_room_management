package controllers

import (
	"erm_backend/internal/parsers"
	"erm_backend/internal/repositories"
	"erm_backend/internal/responses"
	"github.com/julienschmidt/httprouter"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
)

type ticketController struct {
	controller
	ticketRepository      *repositories.TicketRepository
	reservationRepository *repositories.ReservationRepository
	guestRepository       *repositories.GuestRepository
}

func newTicketController(logger *log.Logger, ticketRepository *repositories.TicketRepository, reservationRepository *repositories.ReservationRepository, guestRepository *repositories.GuestRepository) *ticketController {
	return &ticketController{
		controller:            newController(logger),
		ticketRepository:      ticketRepository,
		reservationRepository: reservationRepository,
		guestRepository:       guestRepository,
	}
}

func (c *ticketController) GetTicket(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	ticket, err := c.ticketRepository.GetTicket(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, ticket, "ticket")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *ticketController) GetTickets(w http.ResponseWriter, r *http.Request) {
	tickets, err := c.ticketRepository.GetTickets()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, tickets, "tickets")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *ticketController) CreateTicket(w http.ResponseWriter, r *http.Request) {
	c.handleSaveTicket(w, r, false)
}

func (c *ticketController) UpdateTicket(w http.ResponseWriter, r *http.Request) {
	c.handleSaveTicket(w, r, true)
}

func (c *ticketController) DeleteTicket(w http.ResponseWriter, r *http.Request) {
	deleteError := &responses.DeleteError{}
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	generalDatabaseError := "Database error. Please try again later."
	ticket, err := c.ticketRepository.GetTicket(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalDatabaseError, http.StatusInternalServerError)
		}
	}

	if deleteError.ErrorsCount == 0 {
		c.ticketRepository.DeleteTicket(ticket, deleteError)
	}

	if deleteError.ErrorsCount == 0 {
		_, err = c.reservationRepository.UpdateReservationTotalPrice(ticket.Reservation)
		if err != nil {
			deleteError.AddError(generalDatabaseError, http.StatusInternalServerError)
		}
	}

	if deleteError.ErrorsCount > 0 {
		err = c.writeWrappedJson(w, deleteError.StatusCode, deleteError, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	c.writeEmptyResponse(w, http.StatusOK)
}

func (c *ticketController) handleSaveTicket(w http.ResponseWriter, r *http.Request, parseId bool) {
	ticketErrors := &responses.TicketErrors{}
	ticket := parsers.ParseTicketFromRequest(r, parseId, ticketErrors)
	params := httprouter.ParamsFromContext(r.Context())

	if parseId {
		id, err := strconv.Atoi(params.ByName("id"))

		if err != nil || int(ticket.ID) != id {
			ticketErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}
	}

	if ticketErrors.ErrorsCount == 0 {
		reservation, err := c.reservationRepository.GetReservation(int(ticket.ReservationID))
		if err != nil {
			ticketErrors.AddError("", "Reservation not found.", http.StatusBadRequest)
		}
		ticket.Reservation = reservation

		if !parseId && reservation.DateCancelled.Valid {
			ticketErrors.AddError("", "Reservation is cancelled. You cannot add new tickets to it.", http.StatusBadRequest)
		}

		guest, err := c.guestRepository.GetGuest(int(ticket.GuestID))
		if err != nil {
			ticketErrors.AddError("", "Guest not found.", http.StatusBadRequest)
		}
		ticket.Guest = guest

		if ticketErrors.ErrorsCount == 0 {
			ticket = c.ticketRepository.SaveTicket(ticket, reservation, guest, ticketErrors)
		}

		if ticketErrors.ErrorsCount == 0 {
			_, err = c.reservationRepository.UpdateReservationTotalPrice(reservation)
			if err != nil {
				ticketErrors.AddError("", "Database error. Please try again later.", http.StatusInternalServerError)
			}
		}
	}

	if ticketErrors.ErrorsCount > 0 {
		err := c.writeWrappedJson(w, ticketErrors.StatusCode, ticketErrors, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, ticket, "ticket")
	if err != nil {
		c.logger.Println(err)
	}
}
