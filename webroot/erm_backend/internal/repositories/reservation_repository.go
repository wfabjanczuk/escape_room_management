package repositories

import (
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type ReservationRepository struct {
	repository
}

func NewReservationRepository(logger *log.Logger, db *gorm.DB) *ReservationRepository {
	return &ReservationRepository{
		repository{
			logger: logger,
			db:     db,
		},
	}
}

func (r *ReservationRepository) GetReservation(id int) (models.Reservation, error) {
	var reservation models.Reservation
	result := r.db.Preload("Room").First(&reservation, id)

	return reservation, result.Error
}

func (r *ReservationRepository) GetReservations() ([]models.Reservation, error) {
	var reservations []models.Reservation
	result := r.db.Order("id asc").Preload("Room").Find(&reservations)

	return reservations, result.Error
}

func (r *ReservationRepository) DeleteReservation(id int, deleteError *responses.DeleteError) {
	var ticketCount int64
	generalError := "Database error. Please try again later."

	reservation, err := r.GetReservation(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Model(&models.Ticket{}).Where("reservation_id = ?", id).Count(&ticketCount)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
		return
	}

	if ticketCount > 0 {
		deleteError.AddError("Delete reservation's tickets first.", http.StatusBadRequest)
		return
	}

	result = r.db.Delete(&reservation)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
	}
}

func (r *ReservationRepository) GetReservationTickets(id int) ([]models.Ticket, error) {
	var tickets []models.Ticket

	_, err := r.GetReservation(id)
	if err != nil {
		return tickets, err
	}

	result := r.db.
		Preload("Guest").Preload("Reservation").Preload("Reservation.Room").
		Where("reservation_id = ?", id).Find(&tickets)

	return tickets, result.Error
}
