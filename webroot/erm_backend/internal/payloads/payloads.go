package payloads

type GuestPayload struct {
	UserPayload
	DiscountPercent string `json:"discountPercent"`
}

type UserPayload struct {
	Id          string `json:"id"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	IsActive    string `json:"isActive"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	PhoneNumber string `json:"phoneNumber"`
	DateBirth   string `json:"dateBirth"`
	RoleID      string `json:"roleId"`
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

type ReviewPayload struct {
	Id      string `json:"id"`
	GuestID string `json:"guestId"`
	RoomID  string `json:"roomId"`
	Rating  string `json:"rating"`
	Comment string `json:"comment"`
	Reply   string `json:"reply"`
}

type SignInPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
