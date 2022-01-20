package parsers

import (
	"encoding/json"
	"erm_backend/internal/constants"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"erm_backend/internal/types"
	"github.com/asaskevich/govalidator"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
	"time"
)

func ParseUserFromRequest(r *http.Request, parseId bool, userErrors *responses.UserErrors) models.User {
	var userPayload payloads.UserPayload
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&userPayload)
	if err != nil {
		userErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return user
	}

	user = extractUser(userPayload, parseId, userErrors)
	validateUser(user, parseId, userErrors)

	if userErrors.ErrorsCount > 0 {
		return user
	}

	if len(user.Password) > 0 {
		passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

		if err != nil {
			userErrors.AddError("", "Error during password hash generation. Please try again later.", http.StatusInternalServerError)
			return user
		}

		user.Password = string(passwordHash)
	}

	return user
}

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

func validateUser(user models.User, parseId bool, userErrors *responses.UserErrors) {
	result, err := govalidator.ValidateStruct(user)
	if !result {
		parseStructError(err, userErrors)
	}

	if parseId && user.ID < 1 {
		userErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}
}
