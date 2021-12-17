package payloads

type GuestPayload struct {
	Id              string `json:"id"`
	Email           string `json:"email"`
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
