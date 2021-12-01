package models

import (
	"database/sql"
	"erm_backend/internal/types"
	"github.com/shopspring/decimal"
	"time"
)

type Guest struct {
	Id              uint            `gorm:"primarykey" json:"id"`
	Email           string          `json:"email"`
	FirstName       string          `json:"firstName"`
	LastName        string          `json:"lastName"`
	PhoneNumber     string          `json:"phoneNumber"`
	DateBirth       types.Date      `json:"dateBirth"`
	DiscountPercent types.NullInt64 `json:"discountPercent"`
}

type Ticket struct {
	Id                   uint            `gorm:"primarykey" json:"id"`
	Price                decimal.Decimal `json:"price"`
	Reservation          Reservation     `json:"reservation"`
	Guest                Guest           `json:"guest"`
	GuestAllowedToCancel bool            `json:"guestAllowedToCancel"`
}

type Reservation struct {
	Id            uint            `gorm:"primarykey" json:"id"`
	Room          Room            `json:"room"`
	TotalPrice    decimal.Decimal `json:"totalPrice"`
	DateFrom      time.Time       `json:"dateFrom"`
	DateTo        time.Time       `json:"dateTo"`
	DateCancelled sql.NullTime    `json:"dateCancelled"`
}

type Room struct {
	Id              uint            `gorm:"primarykey" json:"id"`
	Name            string          `json:"name"`
	BaseTicketPrice decimal.Decimal `json:"baseTicketPrice"`
	MinParticipants uint            `json:"minParticipants"`
	MaxParticipants uint            `json:"maxParticipants"`
	MinAge          types.NullInt64 `json:"minAge"`
}
