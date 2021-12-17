package parsers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"github.com/asaskevich/govalidator"
	"github.com/shopspring/decimal"
	"net/http"
	"regexp"
	"strconv"
)

func ParseTicketFromRequest(r *http.Request, parseId bool, ticketErrors *responses.TicketErrors) models.Ticket {
	var ticketPayload payloads.TicketPayload
	var ticket models.Ticket

	err := json.NewDecoder(r.Body).Decode(&ticketPayload)
	if err != nil {
		ticketErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return ticket
	}

	ticket = extractTicket(ticketPayload, parseId, ticketErrors)
	validateTicket(ticket, parseId, ticketErrors)

	return ticket
}

func extractTicket(payload payloads.TicketPayload, parseId bool, ticketErrors *responses.TicketErrors) models.Ticket {
	var ticket models.Ticket

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			ticketErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}

		ticket.ID = uint(id)
	}

	priceInvalidFormatMessage := "Only positive numbers with 2 decimal points allowed."
	match, err := regexp.MatchString("^[0-9]+\\.[0-9]{2}$", payload.Price)
	if !match || err != nil {
		ticketErrors.AddError("price", priceInvalidFormatMessage, http.StatusBadRequest)
	}
	price, err := decimal.NewFromString(payload.Price)
	if err != nil {
		ticketErrors.AddError("price", priceInvalidFormatMessage, http.StatusBadRequest)
	}
	ticket.Price = price

	if payload.ReservationID == "" {
		ticket.ReservationID = 0
	} else {
		reservationId, err := strconv.Atoi(payload.ReservationID)
		if err != nil {
			ticketErrors.AddError("reservationId", "Invalid reservation ID.", http.StatusBadRequest)
		}
		ticket.ReservationID = uint(reservationId)
	}

	if payload.GuestID == "" {
		ticket.GuestID = 0
	} else {
		guestId, err := strconv.Atoi(payload.GuestID)
		if err != nil {
			ticketErrors.AddError("guestId", "Invalid guest ID.", http.StatusBadRequest)
		}
		ticket.GuestID = uint(guestId)
	}

	ticket.GuestAllowedToCancel = payload.GuestAllowedToCancel == "1"

	return ticket
}

func validateTicket(ticket models.Ticket, parseId bool, ticketErrors *responses.TicketErrors) {
	result, err := govalidator.ValidateStruct(ticket)
	if !result {
		parseStructError(err, ticketErrors)
	}

	if parseId && ticket.ID < 1 {
		ticketErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}

	if !ticket.Price.IsPositive() {
		ticketErrors.AddError("price", "This number must be greater than zero.", http.StatusBadRequest)
	}
}
