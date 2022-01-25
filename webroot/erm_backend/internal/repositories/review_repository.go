package repositories

import (
	"erm_backend/internal/models"
	"gorm.io/gorm"
	"log"
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

func (r *ReviewRepository) GetReviews() ([]models.Review, error) {
	var reviews []models.Review
	result := r.db.Preload("Guest").Preload("Guest.User").Preload("Room").Find(&reviews)

	return reviews, result.Error
}
