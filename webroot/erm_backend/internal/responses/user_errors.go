package responses

import "log"

type UserErrors struct {
	ErrorsCount int      `json:"-"`
	StatusCode  int      `json:"-"`
	General     []string `json:"general,omitempty"`
	Email       []string `json:"email,omitempty"`
	Password    []string `json:"password,omitempty"`
	FirstName   []string `json:"firstName,omitempty"`
	LastName    []string `json:"lastName,omitempty"`
	PhoneNumber []string `json:"phoneNumber,omitempty"`
	DateBirth   []string `json:"dateBirth,omitempty"`
	RoleId      []string `json:"roleId,omitempty"`
}

func (e *UserErrors) AddError(key, message string, status int) {
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
	case "roleId":
		e.RoleId = append(e.RoleId, message)
	case "":
		e.General = append(e.General, message)
	default:
		log.Fatal("Adding user error failed.")
	}

	e.ErrorsCount++
	e.StatusCode = status
}
