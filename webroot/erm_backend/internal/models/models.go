package models

import (
	"erm_backend/internal/types"
	"github.com/shopspring/decimal"
)

type Guest struct {
	ID              uint            `gorm:"primarykey" json:"id" valid:"-"`
	UserID          uint            `json:"userId" valid:"-"`
	User            User            `json:"user" valid:"required"`
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
	AverageRating   float64         `json:"averageRating" valid:"-"`
	RatingsCount    uint            `json:"ratingsCount" valid:"-"`
	MinParticipants uint            `json:"minParticipants" valid:"-"`
	MaxParticipants uint            `json:"maxParticipants" valid:"-"`
	MinAge          types.NullInt64 `json:"minAge" valid:"-"`
}

type Review struct {
	ID      uint   `gorm:"primarykey" json:"id" valid:"-"`
	GuestID uint   `json:"guestId" valid:"required"`
	Guest   Guest  `json:"guest" valid:"-"`
	RoomID  uint   `json:"roomId" valid:"required"`
	Room    Room   `json:"room" valid:"-"`
	Rating  uint   `json:"rating" valid:"-"`
	Comment string `json:"comment" valid:"maxstringlength(300)"`
	Reply   string `json:"reply" valid:"maxstringlength(300)"`
}

type User struct {
	ID          uint       `gorm:"primarykey" json:"id" valid:"-"`
	FirstName   string     `json:"firstName" valid:"required,utfletter,maxstringlength(50)"`
	LastName    string     `json:"lastName" valid:"required,utfletter,maxstringlength(50)"`
	PhoneNumber string     `json:"phoneNumber" valid:"required,utfdigit,maxstringlength(12)"`
	DateBirth   types.Date `json:"dateBirth" valid:"-"`
	Email       string     `json:"email" valid:"required,email,maxstringlength(320)"`
	Password    string     `json:"-" valid:"minstringlength(8),maxstringlength(128)"`
	IsActive    bool       `json:"isActive" valid:"-"`
	RoleID      uint       `json:"roleId" valid:"-"`
	Role        Role       `json:"role" valid:"-"`
}

type Role struct {
	ID   uint   `gorm:"primarykey" json:"id" valid:"-"`
	Name string `json:"name" valid:"-"`
}
