package parsers

import (
	"database/sql"
	"encoding/json"
	"erm_backend/internal/constants"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"erm_backend/internal/types"
	"github.com/asaskevich/govalidator"
	"net/http"
	"strconv"
	"time"
)

func ParseReservationFromRequest(r *http.Request, parseId bool, reservationErrors *responses.ReservationErrors) models.Reservation {
	var reservationPayload payloads.ReservationPayload
	var reservation models.Reservation

	err := json.NewDecoder(r.Body).Decode(&reservationPayload)
	if err != nil {
		reservationErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return reservation
	}

	reservation = extractReservation(reservationPayload, parseId, reservationErrors)
	validateReservation(reservation, parseId, reservationErrors)

	return reservation
}

func extractReservation(payload payloads.ReservationPayload, parseId bool, reservationErrors *responses.ReservationErrors) models.Reservation {
	var reservation models.Reservation

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			reservationErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}

		reservation.ID = uint(id)
	}

	if payload.RoomID == "" {
		reservation.RoomID = 0
	} else {
		roomId, err := strconv.Atoi(payload.RoomID)
		if err != nil {
			reservationErrors.AddError("roomId", "Invalid room ID.", http.StatusBadRequest)
		}
		reservation.RoomID = uint(roomId)
	}

	dateFrom, err := time.Parse(constants.DefaultDateTimeFormat, payload.DateFrom)
	if err != nil {
		reservationErrors.AddError("dateFrom", "This field must be a valid date.", http.StatusBadRequest)
	}
	reservation.DateFrom = types.DateTime{
		Time: dateFrom,
	}

	dateTo, err := time.Parse(constants.DefaultDateTimeFormat, payload.DateTo)
	if err != nil {
		reservationErrors.AddError("dateTo", "This field must be a valid date.", http.StatusBadRequest)
	}
	reservation.DateTo = types.DateTime{
		Time: dateTo,
	}

	if payload.DateCancelled == "" {
		reservation.DateCancelled = types.NullDateTime{
			NullTime: sql.NullTime{
				Valid: false,
			},
		}
	} else {
		dateCancelled, err := time.Parse(constants.DefaultDateTimeFormat, payload.DateCancelled)
		if err != nil {
			reservationErrors.AddError("dateCancelled", "This field must be a valid date.", http.StatusBadRequest)
		}
		reservation.DateCancelled = types.NullDateTime{
			NullTime: sql.NullTime{
				Valid: true,
				Time:  dateCancelled,
			},
		}
	}

	return reservation
}

func validateReservation(reservation models.Reservation, parseId bool, reservationErrors *responses.ReservationErrors) {
	result, err := govalidator.ValidateStruct(reservation)
	if !result {
		parseStructError(err, reservationErrors)
	}

	if parseId && reservation.ID < 1 {
		reservationErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}

	if !reservation.DateTo.After(reservation.DateFrom.Time) {
		reservationErrors.AddError("dateTo", "\"Date to\" must be after \"date from\".", http.StatusBadRequest)
	}
}
