package parsers

import (
	"database/sql"
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"erm_backend/internal/types"
	"github.com/asaskevich/govalidator"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
)

func ParseGuestFromRequest(r *http.Request, parseId, signUp bool, guestErrors *responses.GuestErrors) models.Guest {
	var guestPayload payloads.GuestPayload
	var guest models.Guest

	err := json.NewDecoder(r.Body).Decode(&guestPayload)
	if err != nil {
		guestErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return guest
	}

	guest = extractGuest(guestPayload, parseId, guestErrors)
	validateGuest(guest, parseId, guestErrors)

	if guestErrors.ErrorsCount > 0 {
		return guest
	}

	if len(guest.User.Password) > 0 {
		passwordHash, err := bcrypt.GenerateFromPassword([]byte(guest.User.Password), bcrypt.DefaultCost)

		if err != nil {
			guestErrors.AddError("", "Error during password hash generation. Please try again later.", http.StatusInternalServerError)
			return guest
		}

		guest.User.Password = string(passwordHash)
	}

	if signUp {
		guest.User.IsActive = true
		guest.DiscountPercent = types.NullInt64{
			NullInt64: sql.NullInt64{
				Valid: false,
				Int64: 0,
			},
		}
	}

	return guest
}

func extractGuest(payload payloads.GuestPayload, parseId bool, guestErrors *responses.GuestErrors) models.Guest {
	var guest models.Guest

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			guestErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}

		guest.ID = uint(id)
	}

	guest.User = extractUser(payload.UserPayload, false, &guestErrors.UserErrors)

	if len(payload.DiscountPercent) > 0 {
		discountPercent, err := strconv.Atoi(payload.DiscountPercent)
		if err != nil || discountPercent < 0 || discountPercent > 20 {
			guestErrors.AddError("discountPercent", "This number must be from 0 to 20.", http.StatusBadRequest)
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
		guestErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}
}
