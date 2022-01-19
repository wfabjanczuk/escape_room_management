package parsers

import (
	"erm_backend/internal/constants"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"erm_backend/internal/types"
	"net/http"
	"strconv"
	"time"
)

func extractUser(payload payloads.UserPayload, parseId bool, userErrors *responses.UserErrors) models.User {
	var user models.User

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			userErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}

		user.ID = uint(id)
	}

	user.Email = payload.Email
	user.IsActive = payload.IsActive == "1"
	if len(payload.Password) > 0 {
		user.Password = payload.Password
	}

	user.FirstName = payload.FirstName
	user.LastName = payload.LastName
	user.PhoneNumber = payload.PhoneNumber

	dateBirth, err := time.Parse(constants.DefaultDateFormat, payload.DateBirth)
	if err != nil {
		userErrors.AddError("dateBirth", "Invalid date of birth.", http.StatusBadRequest)
	}
	user.DateBirth = types.Date{
		Time: dateBirth,
	}

	return user
}
