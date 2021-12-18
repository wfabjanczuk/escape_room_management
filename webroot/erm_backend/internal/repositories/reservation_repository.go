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

func (r *ReservationRepository) SaveReservation(reservation models.Reservation, reservationErrors *responses.ReservationErrors) {
	if !r.IsRoomAvailable(reservation.RoomID, reservation.DateFrom, reservation.DateTo, sql.NullInt64{
		Int64: int64(reservation.ID),
		Valid: reservation.ID > 0,
	}) {
		reservationErrors.AddError("", "Room is not available in the given date range.", http.StatusInternalServerError)
		return
	}

	result := r.db.Save(&reservation)

	if result.Error != nil {
		reservationErrors.AddError("", "Saving reservation failed. Please try again later.", http.StatusInternalServerError)
		return
	}

	reservation, err := r.UpdateReservationTotalPrice(reservation)
	if err != nil {
		reservationErrors.AddError("", "Saving reservation failed. Please try again later.", http.StatusInternalServerError)
	}
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
		Preload("Guest").Preload("Reservation").Preload("Reservation.Room").
		Where("reservation_id = ?", id).Find(&tickets)

	return tickets, result.Error
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
