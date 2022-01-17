package models

import (
	"erm_backend/internal/types"
	"github.com/shopspring/decimal"
)

type Guest struct {
	ID              uint            `gorm:"primarykey" json:"id" valid:"-"`
	Email           string          `json:"email" valid:"required,email,maxstringlength(100)"`
	FirstName       string          `json:"firstName" valid:"required,utfletter,maxstringlength(50)"`
	LastName        string          `json:"lastName" valid:"required,utfletter,maxstringlength(50)"`
	PhoneNumber     string          `json:"phoneNumber" valid:"required,utfdigit,maxstringlength(12)"`
	DateBirth       types.Date      `json:"dateBirth" valid:"-"`
	DiscountPercent types.NullInt64 `json:"discountPercent" valid:"-"`
}

type Ticket struct {
	ID                   uint            `gorm:"primarykey" json:"id" valid:"-"`
	Price                decimal.Decimal `json:"price" valid:"required"`
	ReservationID        uint            `json:"reservationId" valid:"required"`
	Reservation          Reservation     `json:"reservation" valid:"-"`
	GuestID              uint            `json:"guestId" valid:"required"`
	Guest                Guest           `json:"guest" valid:"-"`
	GuestAllowedToCancel bool            `json:"guestAllowedToCancel" valid:"-"`
}

type Reservation struct {
	ID            uint               `gorm:"primarykey" json:"id" valid:"-"`
	RoomID        uint               `json:"roomId" valid:"required"`
	Room          Room               `json:"room" valid:"-"`
	TotalPrice    decimal.Decimal    `json:"totalPrice" valid:"-"`
	DateFrom      types.DateTime     `json:"dateFrom" valid:"required"`
	DateTo        types.DateTime     `json:"dateTo" valid:"required"`
	DateCancelled types.NullDateTime `json:"dateCancelled" valid:"-"`
}

type Room struct {
	ID              uint            `gorm:"primarykey" json:"id" valid:"-"`
	Name            string          `json:"name" valid:"required,maxstringlength(100)"`
	BaseTicketPrice decimal.Decimal `json:"baseTicketPrice" valid:"required"`
	MinParticipants uint            `json:"minParticipants" valid:"-"`
	MaxParticipants uint            `json:"maxParticipants" valid:"-"`
	MinAge          types.NullInt64 `json:"minAge" valid:"-"`
}

type User struct {
	ID        uint   `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}
