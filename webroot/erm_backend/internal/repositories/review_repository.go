package repositories

import (
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type ReviewRepository struct {
	repository
}

func newReviewRepository(logger *log.Logger, db *gorm.DB) *ReviewRepository {
	return &ReviewRepository{
		repository{
			logger: logger,
			db:     db,
		},
	}
}

func (r *ReviewRepository) GetReview(id int) (models.Review, error) {
	var review models.Review
	result := r.db.Preload("Guest").Preload("Guest.User").Preload("Room").First(&review, id)

	return review, result.Error
}

func (r *ReviewRepository) GetReviewByGuestAndRoom(guestId, roomId uint) (models.Review, error) {
	var review models.Review
	result := r.db.Preload("Guest").Preload("Guest.User").Preload("Room").
		Where("guest_id = ? and room_id = ?", guestId, roomId).First(&review)

	return review, result.Error
}

func (r *ReviewRepository) GetReviews() ([]models.Review, error) {
	var reviews []models.Review
	result := r.db.Preload("Guest").Preload("Guest.User").Preload("Room").Find(&reviews)

	return reviews, result.Error
}

func (r *ReviewRepository) SaveReview(review models.Review, reviewErrors *responses.ReviewErrors) models.Review {
	result := r.db.Save(&review)

	if review.ID == 0 {
		_, err := r.GetReviewByGuestAndRoom(review.GuestID, review.RoomID)
		if err != gorm.ErrRecordNotFound {
			reviewErrors.AddError("", "Review for given guest and room already exists.", http.StatusBadRequest)
		}
	}

	if result.Error != nil {
		reviewErrors.AddError("", "Saving review failed. Please try again later.", http.StatusInternalServerError)
	}

	return review
}

func (r *ReviewRepository) DeleteReview(id int, deleteError *responses.DeleteError) {
	generalError := "Database error. Please try again later."

	review, err := r.GetReview(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Delete(&review)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
	}
}
