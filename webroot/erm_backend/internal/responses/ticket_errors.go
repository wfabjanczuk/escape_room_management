package responses

import "log"

type TicketErrors struct {
	ErrorsCount          int      `json:"-"`
	StatusCode           int      `json:"-"`
	General              []string `json:"general,omitempty"`
	Price                []string `json:"price,omitempty"`
	ReservationID        []string `json:"reservationId,omitempty"`
	GuestID              []string `json:"guestId,omitempty"`
	GuestAllowedToCancel []string `json:"guestAllowedToCancel,omitempty"`
}

func (e *TicketErrors) AddError(key, message string, status int) {
	switch key {
	case "price":
		e.Price = append(e.Price, message)
	case "reservationId":
		e.ReservationID = append(e.ReservationID, message)
	case "guestId":
		e.GuestID = append(e.GuestID, message)
	case "guestAllowedToCancel":
		e.GuestAllowedToCancel = append(e.GuestAllowedToCancel, message)
	case "":
		e.General = append(e.General, message)
	default:
		log.Fatal("Adding ticket error failed.")
	}

	e.ErrorsCount++
	e.StatusCode = status
}
