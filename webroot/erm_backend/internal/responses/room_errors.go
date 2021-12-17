package responses

import "log"

type RoomErrors struct {
	ErrorsCount     int      `json:"-"`
	StatusCode      int      `json:"-"`
	General         []string `json:"general,omitempty"`
	Name            []string `json:"name,omitempty"`
	BaseTicketPrice []string `json:"baseTicketPrice,omitempty"`
	MinParticipants []string `json:"minParticipants,omitempty"`
	MaxParticipants []string `json:"maxParticipants,omitempty"`
	MinAge          []string `json:"minAge,omitempty"`
}

func (e *RoomErrors) AddError(key, message string, status int) {
	switch key {
	case "name":
		e.Name = append(e.Name, message)
	case "baseTicketPrice":
		e.BaseTicketPrice = append(e.BaseTicketPrice, message)
	case "minParticipants":
		e.MinParticipants = append(e.MinParticipants, message)
	case "maxParticipants":
		e.MaxParticipants = append(e.MaxParticipants, message)
	case "minAge":
		e.MinAge = append(e.MinAge, message)
	case "":
		e.General = append(e.General, message)
	default:
		log.Fatal("Adding room error failed.")
	}

	e.ErrorsCount++
	e.StatusCode = status
}
