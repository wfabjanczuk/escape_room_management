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
	"strings"
	"time"
)

func ParseGuestFromRequest(r *http.Request, parseId bool, guestErrors *responses.GuestErrors) models.Guest {
	var guestPayload payloads.GuestPayload
	var guest models.Guest

	err := json.NewDecoder(r.Body).Decode(&guestPayload)
	if err != nil {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusBadRequest
		guestErrors.General = append(guestErrors.General, "Invalid form data")

		return guest
	}

	guest = extractGuest(guestPayload, parseId, guestErrors)
	validateGuest(guest, parseId, guestErrors)

	return guest
}

func extractGuest(payload payloads.GuestPayload, parseId bool, guestErrors *responses.GuestErrors) models.Guest {
	var guest models.Guest

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			guestErrors.ErrorsCount++
			guestErrors.StatusCode = http.StatusBadRequest
			guestErrors.General = append(guestErrors.General, "Invalid form data")
		}

		guest.ID = uint(id)
	}

	guest.Email = payload.Email
	guest.FirstName = payload.FirstName
	guest.LastName = payload.LastName
	guest.PhoneNumber = payload.PhoneNumber

	dateBirth, err := time.Parse(constants.DefaultDateFormat, payload.DateBirth)
	if err != nil {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusBadRequest
		guestErrors.DateBirth = append(guestErrors.DateBirth, "Invalid date of birth")
	}
	guest.DateBirth = types.Date{
		Time: dateBirth,
	}

	if len(payload.DiscountPercent) > 0 {
		discountPercent, err := strconv.Atoi(payload.DiscountPercent)
		if err != nil || discountPercent < 0 || discountPercent > 20 {
			guestErrors.ErrorsCount++
			guestErrors.StatusCode = http.StatusBadRequest
			guestErrors.DiscountPercent = append(guestErrors.DiscountPercent, "Invalid discount percent")
		}

		guest.DiscountPercent = types.NullInt64{
			NullInt64: sql.NullInt64{
				Int64: int64(discountPercent),
				Valid: true,
			},
		}
	} else {
		guest.DiscountPercent = types.NullInt64{
			NullInt64: sql.NullInt64{
				Int64: 0,
				Valid: false,
			},
		}
	}

	return guest
}

func validateGuest(guest models.Guest, parseId bool, guestErrors *responses.GuestErrors) {
	result, err := govalidator.ValidateStruct(guest)
	if !result {
		parseStructError(err, guestErrors)
	}

	if parseId && guest.ID < 1 {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusBadRequest
		guestErrors.General = append(guestErrors.General, "Invalid form data")
	}
}

func parseStructError(err error, guestErrors *responses.GuestErrors) {
	errorSlice := strings.Split(err.Error(), ";")

	for _, fieldError := range errorSlice {
		errorParts := strings.Split(fieldError, ":")
		message := transformErrorMessage(strings.TrimSpace(errorParts[1]))

		putStructError(errorParts[0], message, guestErrors)
	}
}

func putStructError(key, message string, guestErrors *responses.GuestErrors) {
	guestErrors.StatusCode = http.StatusBadRequest

	switch key {
	case "email":
		guestErrors.ErrorsCount++
		guestErrors.Email = append(guestErrors.Email, message)
	case "firstName":
		guestErrors.ErrorsCount++
		guestErrors.FirstName = append(guestErrors.FirstName, message)
	case "lastName":
		guestErrors.ErrorsCount++
		guestErrors.LastName = append(guestErrors.LastName, message)
	case "phoneNumber":
		guestErrors.ErrorsCount++
		guestErrors.PhoneNumber = append(guestErrors.PhoneNumber, message)
	case "dateBirth":
		guestErrors.ErrorsCount++
		guestErrors.DateBirth = append(guestErrors.DateBirth, message)
	case "discountPercent":
		guestErrors.ErrorsCount++
		guestErrors.DiscountPercent = append(guestErrors.DiscountPercent, message)
	default:
		guestErrors.ErrorsCount++
		guestErrors.General = append(guestErrors.General, message)
	}
}
