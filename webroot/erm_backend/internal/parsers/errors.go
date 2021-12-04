package parsers

type GuestErrors struct {
	ErrorsCount     int      `json:"-"`
	StatusCode      int      `json:"-"`
	General         []string `json:"general,omitempty"`
	Email           []string `json:"email,omitempty"`
	FirstName       []string `json:"firstName,omitempty"`
	LastName        []string `json:"lastName,omitempty"`
	PhoneNumber     []string `json:"phoneNumber,omitempty"`
	DateBirth       []string `json:"dateBirth,omitempty"`
	DiscountPercent []string `json:"discountPercent,omitempty"`
}
