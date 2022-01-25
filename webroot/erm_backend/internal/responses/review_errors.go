package responses

import "log"

type ReviewErrors struct {
	ErrorsCount int      `json:"-"`
	StatusCode  int      `json:"-"`
	General     []string `json:"general,omitempty"`
	GuestId     []string `json:"guestId,omitempty"`
	RoomId      []string `json:"roomId,omitempty"`
	Rating      []string `json:"rating,omitempty"`
	Comment     []string `json:"comment,omitempty"`
	Reply       []string `json:"reply,omitempty"`
}

func (e *ReviewErrors) AddError(key, message string, status int) {
	switch key {
	case "guestId":
		e.GuestId = append(e.GuestId, message)
	case "roomId":
		e.RoomId = append(e.RoomId, message)
	case "rating":
		e.Rating = append(e.Rating, message)
	case "comment":
		e.Comment = append(e.Comment, message)
	case "reply":
		e.Reply = append(e.Reply, message)
	case "":
		e.General = append(e.General, message)
	default:
		log.Fatal("Adding review error failed.")
	}

	e.ErrorsCount++
	e.StatusCode = status
}
