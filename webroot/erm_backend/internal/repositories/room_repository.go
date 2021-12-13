package repositories

import (
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type RoomRepository struct {
	repository
}

func NewRoomRepository(logger *log.Logger, db *gorm.DB) *RoomRepository {
	return &RoomRepository{
		repository{
			logger: logger,
			db:     db,
		},
	}
}

func (r *RoomRepository) GetRoom(id int) (models.Room, error) {
	var room models.Room
	result := r.db.First(&room, id)

	return room, result.Error
}

func (r *RoomRepository) GetRooms() ([]models.Room, error) {
	var rooms []models.Room
	result := r.db.Order("id asc").Find(&rooms)

	return rooms, result.Error
}

func (r *RoomRepository) DeleteRoom(id int, deleteError *responses.DeleteError) {
	var reservationCount int64
	generalError := "Database error. Please try again later."

	room, err := r.GetRoom(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Model(&models.Reservation{}).Where("room_id = ?", id).Count(&reservationCount)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
		return
	}

	if reservationCount > 0 {
		deleteError.AddError("Delete room's reservations first.", http.StatusBadRequest)
		return
	}

	result = r.db.Delete(&room)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
	}
}
