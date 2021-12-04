package models

import (
	"erm_backend/internal/types"
	"github.com/shopspring/decimal"
)

type Guest struct {
	ID              uint            `gorm:"primarykey" json:"id" valid:"-"`
	Email           string          `json:"email" valid:"required,email,maxstringlength(100)"`
	FirstName       string          `json:"firstName" valid:"required,alpha,maxstringlength(50)"`
	LastName        string          `json:"lastName" valid:"required,alpha,maxstringlength(50)"`
	PhoneNumber     string          `json:"phoneNumber" valid:"required,utfdigit,maxstringlength(12)"`
	DateBirth       types.Date      `json:"dateBirth" valid:"-"`
	DiscountPercent types.NullInt64 `json:"discountPercent" valid:"-"`
}

type Ticket struct {
	ID                   uint            `gorm:"primarykey" json:"id"`
	Price                decimal.Decimal `json:"price"`
	ReservationID        uint            `json:"reservationId"`
	Reservation          Reservation     `json:"reservation"`
	GuestID              uint            `json:"guestId"`
	Guest                Guest           `json:"guest"`
	GuestAllowedToCancel bool            `json:"guestAllowedToCancel"`
}

type Reservation struct {
	ID            uint               `gorm:"primarykey" json:"id"`
	RoomID        uint               `json:"roomId"`
	Room          Room               `json:"room"`
	TotalPrice    decimal.Decimal    `json:"totalPrice"`
	DateFrom      types.DateTime     `json:"dateFrom"`
	DateTo        types.DateTime     `json:"dateTo"`
	DateCancelled types.NullDateTime `json:"dateCancelled"`
}

type Room struct {
	ID              uint            `gorm:"primarykey" json:"id"`
	Name            string          `json:"name"`
	BaseTicketPrice decimal.Decimal `json:"baseTicketPrice"`
	MinParticipants uint            `json:"minParticipants"`
	MaxParticipants uint            `json:"maxParticipants"`
	MinAge          types.NullInt64 `json:"minAge"`
}
