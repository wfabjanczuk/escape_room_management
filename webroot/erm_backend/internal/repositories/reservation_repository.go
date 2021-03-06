package repositories

import (
	"database/sql"
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"erm_backend/internal/types"
	"fmt"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"log"
	"net/http"
	"time"
)

type ReservationRepository struct {
	repository
}

func newReservationRepository(logger *log.Logger, db *gorm.DB) *ReservationRepository {
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

func (r *ReservationRepository) SaveReservation(reservation models.Reservation, reservationErrors *responses.ReservationErrors) models.Reservation {
	if !r.IsRoomAvailable(reservation.RoomID, reservation.DateFrom, reservation.DateTo, sql.NullInt64{
		Int64: int64(reservation.ID),
		Valid: reservation.ID > 0,
	}) {
		reservationErrors.AddError("", "Room is not available in the given date range.", http.StatusInternalServerError)
		return reservation
	}

	result := r.db.Save(&reservation)

	if result.Error != nil {
		reservationErrors.AddError("", "Saving reservation failed. Please try again later.", http.StatusInternalServerError)
		return reservation
	}

	reservation, err := r.UpdateReservationTotalPrice(reservation)
	if err != nil {
		reservationErrors.AddError("", "Saving reservation failed. Please try again later.", http.StatusInternalServerError)
	}

	return reservation
}

func (r *ReservationRepository) IsRoomAvailable(roomId uint, dateFrom, dateTo types.DateTime, id sql.NullInt64) bool {
	var reservationCount int64
	query := r.db.Model(&models.Reservation{})

	overlappingCondition := "room_id = ? and (? between date_from and date_to or ? between date_from and date_to or " +
		"date_from between ? and ? or date_to between ? and ?)"

	if id.Valid {
		query = query.Where(fmt.Sprintf("%s and id <> ?", overlappingCondition),
			roomId, dateFrom, dateTo, dateFrom, dateTo, dateFrom, dateTo, id)
	} else {
		query = query.Where(overlappingCondition, roomId, dateFrom, dateTo, dateFrom, dateTo, dateFrom, dateTo)
	}

	result := query.Count(&reservationCount)
	return result.Error == nil && reservationCount == 0
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
		Preload("Guest").Preload("Guest.User").Preload("Guest.User.Role").Preload("Reservation").Preload("Reservation.Room").
		Where("reservation_id = ?", id).Find(&tickets)

	return tickets, result.Error
}

func (r *ReservationRepository) IsGuestInReservation(guestId, reservationId int) bool {
	var tickets []models.Ticket

	_, err := r.GetReservation(reservationId)
	if err != nil {
		return false
	}

	r.db.Where("reservation_id = ? and guest_id = ?", reservationId, guestId).Find(&tickets)

	return len(tickets) > 0
}

func (r *ReservationRepository) CanGuestCancelReservation(guestId, reservationId int) bool {
	var tickets []models.Ticket

	_, err := r.GetReservation(reservationId)
	if err != nil {
		return false
	}

	r.db.Where("reservation_id = ? and guest_id = ? and guest_allowed_to_cancel = ?", reservationId, guestId, true).Find(&tickets)

	return len(tickets) > 0
}

func (r *ReservationRepository) CanGuestAddRoomReview(guestId, roomId int) bool {
	var ticketCount int64

	r.db.Model(&models.Ticket{}).
		Joins("join reservations on reservations.id = tickets.reservation_id").
		Where(
			"guest_id = ? "+
				"and reservations.room_id = ? "+
				"and reservations.date_to < ? "+
				"and reservations.date_cancelled is NULL",
			guestId,
			roomId,
			time.Now(),
		).
		Count(&ticketCount)

	return ticketCount > 0
}

func (r *ReservationRepository) UpdateReservationTotalPrice(reservation models.Reservation) (models.Reservation, error) {
	reservationTickets, err := r.GetReservationTickets(int(reservation.ID))
	if err != nil {
		return reservation, err
	}

	reservation.TotalPrice = decimal.Decimal{}
	for _, ticket := range reservationTickets {
		reservation.TotalPrice = reservation.TotalPrice.Add(ticket.Price)
	}

	result := r.db.Model(&reservation).Where("id = ?", reservation.ID).Update("total_price", reservation.TotalPrice)
	return reservation, result.Error
}

func (r *ReservationRepository) CancelReservation(id int, cancelError *responses.DeleteError) {
	reservation, err := r.GetReservation(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			cancelError.AddError("Reservation not found.", http.StatusNotFound)
			return
		}

		cancelError.AddError("Please try again later.", http.StatusInternalServerError)
		return
	}

	if reservation.DateFrom.Before(time.Now()) {
		cancelError.AddError("Reservation already started.", http.StatusBadRequest)
		return
	}

	result := r.db.Model(&models.Reservation{}).Where("id = ?", id).Update("date_cancelled", time.Now())
	if result.Error != nil {
		cancelError.AddError("Please try again later.", http.StatusInternalServerError)
	}
}
