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
	User        *UserRepository
}

func NewTable(logger *log.Logger, db *gorm.DB) Table {
	return Table{
		Guest:       newGuestRepository(logger, db),
		Reservation: newReservationRepository(logger, db),
		Room:        newRoomRepository(logger, db),
		Ticket:      newTicketRepository(logger, db),
		User:        newUserRepository(logger, db),
	}
}
