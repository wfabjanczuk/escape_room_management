package parsers

import (
	"database/sql"
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"erm_backend/internal/types"
	"github.com/asaskevich/govalidator"
	"github.com/shopspring/decimal"
	"net/http"
	"regexp"
	"strconv"
)

func ParseRoomFromRequest(r *http.Request, parseId bool, roomErrors *responses.RoomErrors) models.Room {
	var roomPayload payloads.RoomPayload
	var room models.Room

	err := json.NewDecoder(r.Body).Decode(&roomPayload)
	if err != nil {
		roomErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return room
	}

	room = extractRoom(roomPayload, parseId, roomErrors)
	validateRoom(room, parseId, roomErrors)

	return room
}

func extractRoom(payload payloads.RoomPayload, parseId bool, roomErrors *responses.RoomErrors) models.Room {
	var room models.Room

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			roomErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}

		room.ID = uint(id)
	}

	room.Name = payload.Name

	baseTicketPriceInvalidFormatMessage := "Only positive numbers with 2 decimal points allowed."
	match, err := regexp.MatchString("^[0-9]+\\.[0-9]{2}$", payload.BaseTicketPrice)
	if !match || err != nil {
		roomErrors.AddError("baseTicketPrice", baseTicketPriceInvalidFormatMessage, http.StatusBadRequest)
	}
	baseTicketPrice, err := decimal.NewFromString(payload.BaseTicketPrice)
	if err != nil {
		roomErrors.AddError("baseTicketPrice", baseTicketPriceInvalidFormatMessage, http.StatusBadRequest)
	}
	room.BaseTicketPrice = baseTicketPrice

	minParticipants, err := strconv.Atoi(payload.MinParticipants)
	if err != nil {
		roomErrors.AddError("minParticipants", "Invalid min. participants format.", http.StatusBadRequest)
	}
	room.MinParticipants = uint(minParticipants)

	maxParticipants, err := strconv.Atoi(payload.MaxParticipants)
	if err != nil {
		roomErrors.AddError("maxParticipants", "Invalid max. participants format.", http.StatusBadRequest)
	}
	room.MaxParticipants = uint(maxParticipants)

	if payload.MinAge == "" {
		room.MinAge = types.NullInt64{
			NullInt64: sql.NullInt64{
				Valid: false,
			},
		}
	} else {
		minAge, err := strconv.Atoi(payload.MinAge)
		if err != nil {
			roomErrors.AddError("minAge", "Invalid min. age format.", http.StatusBadRequest)
		}
		room.MinAge = types.NullInt64{
			NullInt64: sql.NullInt64{
				Valid: true,
				Int64: int64(minAge),
			},
		}
	}

	return room
}

func validateRoom(room models.Room, parseId bool, roomErrors *responses.RoomErrors) {
	result, err := govalidator.ValidateStruct(room)
	if !result {
		parseStructError(err, roomErrors)
	}

	if parseId && room.ID < 1 {
		roomErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}

	if !room.BaseTicketPrice.IsPositive() {
		roomErrors.AddError("baseTicketPrice", "This number must be greater than zero.", http.StatusBadRequest)
	}

	if room.MinParticipants < 1 {
		roomErrors.AddError("minParticipants", "This number must be greater than zero.", http.StatusBadRequest)
	}

	if room.MaxParticipants < 1 {
		roomErrors.AddError("maxParticipants", "This number must be greater than zero.", http.StatusBadRequest)
	}

	if room.MaxParticipants < room.MinParticipants {
		roomErrors.AddError("maxParticipants",
			"\"Max. participants\" must be greater or equal to \"min. participants\".", http.StatusBadRequest)
	}

	if room.MinAge.Valid && room.MinAge.Int64 < 1 {
		roomErrors.AddError("minAge", "This number must be greater than zero.", http.StatusBadRequest)
	}
}
