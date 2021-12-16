package repositories

import (
	"database/sql"
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

func (r *TicketRepository) SaveTicket(ticket models.Ticket, ticketErrors *responses.TicketErrors) {
	if !r.DoesTicketExist(ticket.ReservationID, ticket.GuestID, sql.NullInt64{
		Int64: int64(ticket.ID),
		Valid: ticket.ID > 0,
	}) {
		ticketErrors.AddError("", "Ticket for chosen reservation and guest already exists.", http.StatusBadRequest)
		return
	}

	result := r.db.Save(&ticket)

	if result.Error != nil {
		ticketErrors.AddError("", "Saving ticket failed. Please try again later.", http.StatusInternalServerError)
	}
}

func (r *TicketRepository) DoesTicketExist(reservationId, guestId uint, id sql.NullInt64) bool {
	var ticketCount int64
	query := r.db.Model(&models.Ticket{})

	if id.Valid {
		query = query.Where("reservation_id = ? and guest_id = ? and id <> ?", reservationId, guestId, id)
	} else {
		query = query.Where("reservation_id = ? and guest_id = ?", reservationId, guestId)
	}

	result := query.Count(&ticketCount)
	return result.Error == nil && ticketCount == 0
}

func (r *TicketRepository) DeleteTicket(id int, deleteError *responses.DeleteError) {
	generalError := "Database error. Please try again later."

	ticket, err := r.GetTicket(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Delete(&ticket)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
	}
}
