package responses

import "log"

type ReservationErrors struct {
	ErrorsCount   int      `json:"-"`
	StatusCode    int      `json:"-"`
	General       []string `json:"general,omitempty"`
	RoomID        []string `json:"roomId,omitempty"`
	DateFrom      []string `json:"dateFrom,omitempty"`
	DateTo        []string `json:"dateTo,omitempty"`
	DateCancelled []string `json:"dateCancelled,omitempty"`
}

func (e *ReservationErrors) AddError(key, message string, status int) {
	switch key {
	case "roomId":
		e.RoomID = append(e.RoomID, message)
	case "dateFrom":
		e.DateFrom = append(e.DateFrom, message)
	case "dateTo":
		e.DateTo = append(e.DateTo, message)
	case "dateCancelled":
		e.DateCancelled = append(e.DateCancelled, message)
	case "":
		e.General = append(e.General, message)
	default:
		log.Fatal("Adding reservation error failed.")
	}

	e.ErrorsCount++
	e.StatusCode = status
}
