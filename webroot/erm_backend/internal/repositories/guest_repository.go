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
		guestErrors.AddError("email", "This email is already used.", http.StatusBadRequest)
		return
	}

	result := r.db.Save(&guest)

	if result.Error != nil {
		guestErrors.AddError("", "Saving guest failed. Please try again later.", http.StatusInternalServerError)
	}
}

func (r *GuestRepository) IsGuestEmailValid(email string, id sql.NullInt64) bool {
	var guestCount int64
	query := r.db.Model(&models.Guest{})

	if id.Valid {
		query = query.Where("email = ? and id <> ?", email, id)
	} else {
		query = query.Where("email = ?", email)
	}

	result := query.Count(&guestCount)
	return result.Error == nil && guestCount == 0
}

func (r *GuestRepository) DeleteGuest(id int, guestDeleteError *responses.GuestDeleteError) {
	var ticketCount int64
	query := r.db.Model(&models.Ticket{}).Where("guest_id = ?", id)
	generalError := "Database error. Please try again later."

	result := query.Count(&ticketCount)
	if result.Error != nil {
		guestDeleteError.AddError(generalError, http.StatusInternalServerError)
		return
	}

	if ticketCount > 0 {
		guestDeleteError.AddError("Delete guest tickets first.", http.StatusBadRequest)
		return
	}

	guest, err := r.GetGuest(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			guestDeleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			guestDeleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result = r.db.Delete(&guest)
	if err != nil {
		guestDeleteError.AddError(generalError, http.StatusInternalServerError)
	}
}

func (r *GuestRepository) GetGuestTickets(id int) ([]models.Ticket, error) {
	var tickets []models.Ticket

	_, err := r.GetGuest(id)
	if err != nil {
		return tickets, err
	}

	result := r.db.
		Preload("Guest").Preload("Reservation").Preload("Reservation.Room").
		Where("guest_id = ?", id).Find(&tickets)

	return tickets, result.Error
}
