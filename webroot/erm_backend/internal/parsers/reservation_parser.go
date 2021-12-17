package parsers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"net/http"
)

func ParseReservationFromRequest(r *http.Request, parseId bool, reservationErrors *responses.ReservationErrors) models.Reservation {
	var reservationPayload payloads.ReservationPayload
	var reservation models.Reservation

	err := json.NewDecoder(r.Body).Decode(&reservationPayload)
	if err != nil {
		reservationErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return reservation
	}

	//reservation = extractTicket(reservationPayload, parseId, reservationErrors)
	//validateTicket(reservation, parseId, reservationErrors)

	return reservation
}
