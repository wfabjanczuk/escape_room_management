package parsers

import (
	"database/sql"
	"erm_backend/internal/constants"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/types"
	"github.com/asaskevich/govalidator"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func ParseGuest(payload payloads.GuestPayload, parseId bool, guestErrors *GuestErrors) (models.Guest, *GuestErrors) {
	guest, guestErrors := extractGuest(payload, parseId, guestErrors)
	if guestErrors.ErrorsCount > 0 {
		return guest, guestErrors
	}

	guestErrors = validateGuest(guest, parseId, guestErrors)
	if guestErrors.ErrorsCount > 0 {
		return guest, guestErrors
	}

	return guest, guestErrors
}

func extractGuest(payload payloads.GuestPayload, parseId bool, guestErrors *GuestErrors) (models.Guest, *GuestErrors) {
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
		guestErrors.DateBirth = append(guestErrors.General, "Invalid date of birth")
	}
	guest.DateBirth = types.Date{
		Time: dateBirth,
	}

	if len(payload.DiscountPercent) > 0 {
		discountPercent, err := strconv.Atoi(payload.DiscountPercent)
		if err != nil {
			guestErrors.ErrorsCount++
			guestErrors.StatusCode = http.StatusBadRequest
			guestErrors.General = append(guestErrors.General, "Invalid discount percent")
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

	return guest, guestErrors
}

func validateGuest(guest models.Guest, parseId bool, guestErrors *GuestErrors) *GuestErrors {
	result, err := govalidator.ValidateStruct(guest)
	if !result {
		parseStructError(err, guestErrors)
	}

	if parseId {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusBadRequest
		guestErrors.General = append(guestErrors.General, "Invalid form data")
	}

	return guestErrors
}

func parseStructError(err error, guestErrors *GuestErrors) {
	errorSlice := strings.Split(err.Error(), ";")

	for _, fieldError := range errorSlice {
		parts := strings.Split(fieldError, ":")
		message := strings.TrimSpace(parts[1])
		message = strings.ToUpper(message[:1]) + message[1:]

		putStructError(parts[0], message, guestErrors)
	}
}

func putStructError(key, message string, guestErrors *GuestErrors) {
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
