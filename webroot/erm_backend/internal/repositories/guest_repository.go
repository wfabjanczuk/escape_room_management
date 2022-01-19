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
	result := r.db.Preload("User").First(&guest, id)

	return guest, result.Error
}

func (r *GuestRepository) GetGuests() ([]models.Guest, error) {
	var guests []models.Guest
	result := r.db.Preload("User").Order("id asc").Find(&guests)

	return guests, result.Error
}

func (r *GuestRepository) SaveGuest(guest models.Guest, guestErrors *responses.GuestErrors) models.Guest {
	if guest.ID > 0 {
		var oldGuest models.Guest

		result := r.db.Preload("User").First(&oldGuest, guest.ID)
		if result.Error != nil {
			guestErrors.AddError("", "Saving guest failed. Please try again later.", http.StatusInternalServerError)
			return guest
		}

		guest.User.ID = oldGuest.User.ID

		if len(guest.User.Password) == 0 {
			guest.User.Password = oldGuest.User.Password
		}
	}

	if guest.User.IsActive && len(guest.User.Password) == 0 {
		guestErrors.AddError("password", "You must set password for active user account.", http.StatusBadRequest)
		return guest
	}

	if !r.IsUserEmailValid(guest.User.Email, sql.NullInt64{
		Int64: int64(guest.User.ID),
		Valid: guest.User.ID > 0,
	}) {
		guestErrors.AddError("email", "This email is already used.", http.StatusBadRequest)
		return guest
	}

	result := r.db.Save(&guest.User)
	if result.Error != nil {
		guestErrors.AddError("", "Saving guest failed. Please try again later.", http.StatusInternalServerError)
		return guest
	}

	result = r.db.Save(&guest)
	if result.Error != nil {
		guestErrors.AddError("", "Saving guest failed. Please try again later.", http.StatusInternalServerError)
	}

	return guest
}

func (r *GuestRepository) IsUserEmailValid(email string, id sql.NullInt64) bool {
	var userCount int64
	query := r.db.Model(&models.User{})

	if id.Valid {
		query = query.Where("email = ? and id <> ?", email, id)
	} else {
		query = query.Where("email = ?", email)
	}

	result := query.Count(&userCount)
	return result.Error == nil && userCount == 0
}

func (r *GuestRepository) DeleteGuest(id int, deleteError *responses.DeleteError) {
	var ticketCount int64
	generalError := "Database error. Please try again later."

	guest, err := r.GetGuest(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Model(&models.Ticket{}).Where("guest_id = ?", id).Count(&ticketCount)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
		return
	}

	if ticketCount > 0 {
		deleteError.AddError("Delete guest's tickets first.", http.StatusBadRequest)
		return
	}

	result = r.db.Delete(&guest)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
	}
}

func (r *GuestRepository) GetGuestTickets(id int) ([]models.Ticket, error) {
	var tickets []models.Ticket

	_, err := r.GetGuest(id)
	if err != nil {
		return tickets, err
	}

	result := r.db.
		Preload("Guest").Preload("Guest.User").Preload("Reservation").Preload("Reservation.Room").
		Where("guest_id = ?", id).Find(&tickets)

	return tickets, result.Error
}
