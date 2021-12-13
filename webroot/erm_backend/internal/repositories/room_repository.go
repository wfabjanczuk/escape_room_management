package repositories

import (
	"erm_backend/internal/models"
	"gorm.io/gorm"
	"log"
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
