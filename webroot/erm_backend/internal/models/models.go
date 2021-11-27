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
	FirstName       string          `json:"first_name"`
	LastName        string          `json:"last_name"`
	PhoneNumber     string          `json:"phone_number"`
	DateBirth       types.Date      `json:"date_birth"`
	DiscountPercent types.NullInt64 `json:"discount_percent"`
}

type Ticket struct {
	Id                   uint            `gorm:"primarykey" json:"id"`
	Price                decimal.Decimal `json:"price"`
	Reservation          Reservation     `json:"reservation"`
	Guest                Guest           `json:"guest"`
	GuestAllowedToCancel bool            `json:"guest_allowed_to_cancel"`
}

type Reservation struct {
	Id            uint            `gorm:"primarykey" json:"id"`
	Room          Room            `json:"room"`
	TotalPrice    decimal.Decimal `json:"total_price"`
	DateFrom      time.Time       `json:"date_from"`
	DateTo        time.Time       `json:"date_to"`
	DateCancelled sql.NullTime    `json:"date_cancelled"`
}

type Room struct {
	Id              uint            `gorm:"primarykey" json:"id"`
	Name            string          `json:"name"`
	BaseTicketPrice decimal.Decimal `json:"base_ticket_price"`
	MinParticipants uint            `json:"min_participants"`
	MaxParticipants uint            `json:"max_participants"`
	MinAge          types.NullInt64 `json:"min_age"`
}
