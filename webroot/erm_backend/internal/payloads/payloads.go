package payloads

type GuestPayload struct {
	Id              string `json:"id"`
	UserId          string `json:"userId"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	IsActive        string `json:"isActive"`
	FirstName       string `json:"firstName"`
	LastName        string `json:"lastName"`
	PhoneNumber     string `json:"phoneNumber"`
	DateBirth       string `json:"dateBirth"`
	DiscountPercent string `json:"discountPercent"`
}

type TicketPayload struct {
	Id                   string `json:"id"`
	Price                string `json:"price"`
	ReservationID        string `json:"reservationId"`
	GuestID              string `json:"guestId"`
	GuestAllowedToCancel string `json:"guestAllowedToCancel"`
}

type ReservationPayload struct {
	Id            string `json:"id"`
	RoomID        string `json:"roomId"`
	DateFrom      string `json:"dateFrom"`
	DateTo        string `json:"dateTo"`
	DateCancelled string `json:"dateCancelled"`
}

type RoomPayload struct {
	Id              string `json:"id"`
	Name            string `json:"name"`
	BaseTicketPrice string `json:"baseTicketPrice"`
	MinParticipants string `json:"minParticipants"`
	MaxParticipants string `json:"maxParticipants"`
	MinAge          string `json:"minAge"`
}
