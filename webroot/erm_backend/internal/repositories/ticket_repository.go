package repositories

import (
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
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

func (r *TicketRepository) DeleteTicket(id int, ticketDeleteError *responses.TicketDeleteError) {
	generalError := "Database error. Please try again later."

	ticket, err := r.GetTicket(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			ticketDeleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			ticketDeleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Delete(&ticket)
	if result.Error != nil {
		ticketDeleteError.AddError(generalError, http.StatusInternalServerError)
	}
}
