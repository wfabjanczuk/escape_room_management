package controllers

import (
	"erm_backend/internal/repositories"
	"log"
)

type Table struct {
	Auth        *authController
	Guest       *guestController
	Reservation *reservationController
	Room        *roomController
	Status      *statusController
	Ticket      *ticketController
	Review      *reviewController
	User        *userController
}

func NewTable(repositoriesTable repositories.Table, logger *log.Logger, jwtSecret, apiName, apiVersion string) Table {
	return Table{
		Auth: newAuthController(
			repositoriesTable.User,
			repositoriesTable.Reservation,
			jwtSecret,
			logger,
		),
		Guest: newGuestController(logger,
			repositoriesTable.Guest,
		),
		Reservation: newReservationController(logger,
			repositoriesTable.Reservation,
			repositoriesTable.Room,
		),
		Room: newRoomController(logger,
			repositoriesTable.Room,
		),
		Status: newStatusController(logger, apiName, apiVersion),
		Ticket: newTicketController(logger,
			repositoriesTable.Ticket,
			repositoriesTable.Reservation,
			repositoriesTable.Guest,
		),
		Review: newReviewController(logger,
			repositoriesTable.Review,
		),
		User: newUserController(logger,
			repositoriesTable.User,
		),
	}
}
