package types

type GuestPayload struct {
	Id              string `json:"id"`
	Email           string `json:"email"`
	FirstName       string `json:"firstName"`
	LastName        string `json:"lastName"`
	PhoneNumber     string `json:"phoneNumber"`
	DateBirth       string `json:"dateBirth"`
	DiscountPercent string `json:"discountPercent"`
}
