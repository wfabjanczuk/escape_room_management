package repositories

import (
	"database/sql"
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
	if !r.IsGuestEmailValid(guest.Email, sql.NullInt64{
		Int64: int64(guest.ID),
		Valid: guest.ID > 0,
	}) {
		guestErrors.AddError("", "This email is already used.", http.StatusBadRequest)
		return
	}

	result := r.db.Save(&guest)

	if result.Error != nil {
		guestErrors.AddError("", "Saving guest failed. Please try again later.", http.StatusInternalServerError)
	}
}

func (r *GuestRepository) IsGuestEmailValid(email string, id sql.NullInt64) bool {
	var count int64
	query := r.db.Model(&models.Guest{})

	if id.Valid {
		query = query.Where("email = ? and id <> ?", email, id)
	} else {
		query = query.Where("email = ?", email)
	}

	result := query.Count(&count)
	return result.Error == nil && count == 0
}

func (r *GuestRepository) DeleteGuest(id int) error {
	guest, err := r.GetGuest(id)
	if err != nil {
		return err
	}

	return r.db.Delete(&guest).Error
}
