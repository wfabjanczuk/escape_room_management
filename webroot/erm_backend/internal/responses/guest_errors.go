package responses

import "log"

type GuestErrors struct {
	UserErrors
	DiscountPercent []string `json:"discountPercent,omitempty"`
}

func (e *GuestErrors) AddError(key, message string, status int) {
	switch key {
	case "email":
		e.Email = append(e.Email, message)
	case "password":
		e.Password = append(e.Password, message)
	case "firstName":
		e.FirstName = append(e.FirstName, message)
	case "lastName":
		e.LastName = append(e.LastName, message)
	case "phoneNumber":
		e.PhoneNumber = append(e.PhoneNumber, message)
	case "dateBirth":
		e.DateBirth = append(e.DateBirth, message)
	case "discountPercent":
		e.DiscountPercent = append(e.DiscountPercent, message)
	case "":
		e.General = append(e.General, message)
	default:
		log.Fatal("Adding guest error failed with key=" + key + " and message=" + message)
	}

	e.ErrorsCount++
	e.StatusCode = status
}
