package repositories

import (
	"gorm.io/gorm"
	"log"
)

type Table struct {
	Guest       *GuestRepository
	Reservation *ReservationRepository
	Room        *RoomRepository
	Ticket      *TicketRepository
	Review      *ReviewRepository
	User        *UserRepository
}

func NewTable(logger *log.Logger, db *gorm.DB) Table {
	return Table{
		Guest:       newGuestRepository(logger, db),
		Reservation: newReservationRepository(logger, db),
		Room:        newRoomRepository(logger, db),
		Ticket:      newTicketRepository(logger, db),
		Review:      newReviewRepository(logger, db),
		User:        newUserRepository(logger, db),
	}
}
