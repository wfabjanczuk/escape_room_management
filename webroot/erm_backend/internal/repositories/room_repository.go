package repositories

import (
	"database/sql"
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type RoomRepository struct {
	repository
}

func newRoomRepository(logger *log.Logger, db *gorm.DB) *RoomRepository {
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

func (r *RoomRepository) GetRoomReviews(id int) ([]models.Review, error) {
	var reviews []models.Review
	result := r.db.Where("room_id = ?", id).Find(&reviews)

	return reviews, result.Error
}

func (r *RoomRepository) GetRoomReservations(id int) ([]models.Reservation, error) {
	var reservations []models.Reservation

	_, err := r.GetRoom(id)
	if err != nil {
		return reservations, err
	}

	result := r.db.Preload("Room").Where("room_id = ?", id).Find(&reservations)

	return reservations, result.Error
}

func (r *RoomRepository) GetRooms() ([]models.Room, error) {
	var rooms []models.Room
	result := r.db.Order("id asc").Find(&rooms)

	return rooms, result.Error
}

func (r *RoomRepository) SaveRoom(room models.Room, roomErrors *responses.RoomErrors) models.Room {
	if !r.IsRoomNameValid(room.Name, sql.NullInt64{
		Int64: int64(room.ID),
		Valid: room.ID > 0,
	}) {
		roomErrors.AddError("name", "This name is already used.", http.StatusBadRequest)
		return room
	}

	if room.ID > 0 {
		oldRoom, err := r.GetRoom(int(room.ID))
		if err != nil {
			roomErrors.AddError("", "Saving room failed. Please try again later.", http.StatusInternalServerError)
			return room
		}

		room.AverageRating = oldRoom.AverageRating
		room.RatingsCount = oldRoom.RatingsCount
	}

	result := r.db.Save(&room)

	if result.Error != nil {
		roomErrors.AddError("", "Saving room failed. Please try again later.", http.StatusInternalServerError)
	}

	return room
}

func (r *RoomRepository) IsRoomNameValid(name string, id sql.NullInt64) bool {
	var roomCount int64
	query := r.db.Model(&models.Room{})

	if id.Valid {
		query = query.Where("name = ? and id <> ?", name, id)
	} else {
		query = query.Where("name = ?", name)
	}

	result := query.Count(&roomCount)
	return result.Error == nil && roomCount == 0
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

func (r *RoomRepository) UpdateRoomRating(roomId int) error {
	log.Println("updating room rating")
	roomReviews, err := r.GetRoomReviews(roomId)
	if err != nil {
		return err
	}

	var ratingSum, averageRating float64
	var ratingsCount uint

	for _, review := range roomReviews {
		ratingSum += float64(review.Rating)
		ratingsCount += 1
	}

	if ratingsCount > 0 {
		averageRating = ratingSum / float64(ratingsCount)
	} else {
		averageRating = 0
	}

	result := r.db.Model(&models.Room{}).Where("id = ?", roomId).
		Updates(map[string]interface{}{
			"average_rating": averageRating,
			"ratings_count":  ratingsCount,
		})

	log.Println(roomId)
	log.Println(len(roomReviews))
	log.Println(roomReviews)
	log.Println(averageRating)
	log.Println(ratingsCount)
	log.Println(result.Error)

	return result.Error
}
