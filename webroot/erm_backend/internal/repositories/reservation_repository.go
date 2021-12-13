package repositories

import (
	"erm_backend/internal/models"
	"gorm.io/gorm"
	"log"
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
