package repositories

import (
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type GuestRepository struct {
	repository
}

func NewGuestRepository(logger *log.Logger, db *gorm.DB) *GuestRepository {
	return &GuestRepository{
		repository{
			logger: logger,
			db:     db,
		},
	}
}

func (r *GuestRepository) GetGuest(id int) (models.Guest, error) {
	var guest models.Guest
	result := r.db.First(&guest, id)

	return guest, result.Error
}

func (r *GuestRepository) GetGuests() ([]models.Guest, error) {
	var guests []models.Guest
	result := r.db.Order("id asc").Find(&guests)

	return guests, result.Error
}

func (r *GuestRepository) SaveGuest(guest models.Guest, guestErrors *responses.GuestErrors) {
	if !r.IsGuestEmailValid(guest.Email) {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusBadRequest
		guestErrors.Email = append(guestErrors.Email, "This email is already used.")

		return
	}

	result := r.db.Save(&guest)

	if result.Error != nil {
		guestErrors.ErrorsCount++
		guestErrors.StatusCode = http.StatusInternalServerError
		guestErrors.General = append(guestErrors.General, "Saving guest failed. Please try again later.")
	}
}

func (r *GuestRepository) IsGuestEmailValid(email string) bool {
	var count int64
	result := r.db.Where("email = ?", email).Count(&count)

	return result.Error == nil && count == 0
}
