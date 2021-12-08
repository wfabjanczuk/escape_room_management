package repositories

import (
	"erm_backend/internal/models"
	"gorm.io/gorm"
	"log"
)

type TicketRepository struct {
	repository
}

func NewTicketRepository(logger *log.Logger, db *gorm.DB) *TicketRepository {
	return &TicketRepository{
		repository{
			logger: logger,
			db:     db,
		},
	}
}

func (r *TicketRepository) GetTicket(id int) (models.Ticket, error) {
	var ticket models.Ticket
	result := r.db.
		Preload("Guest").Preload("Reservation").Preload("Reservation.Room").First(&ticket, id)

	return ticket, result.Error
}

func (r *TicketRepository) GetTickets() ([]models.Ticket, error) {
	var tickets []models.Ticket
	result := r.db.Order("id asc").
		Preload("Guest").Preload("Reservation").Preload("Reservation.Room").Find(&tickets)

	return tickets, result.Error
}
