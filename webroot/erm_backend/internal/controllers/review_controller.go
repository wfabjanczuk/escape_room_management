package controllers

import (
	"erm_backend/internal/repositories"
	"log"
	"net/http"
)

type reviewController struct {
	controller
	reviewRepository *repositories.ReviewRepository
}

func newReviewController(logger *log.Logger, reviewRepository *repositories.ReviewRepository) *reviewController {
	return &reviewController{
		controller:       newController(logger),
		reviewRepository: reviewRepository,
	}
}

func (c *reviewController) GetReviews(w http.ResponseWriter, r *http.Request) {
	reviews, err := c.reviewRepository.GetReviews()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, reviews, "reviews")
	if err != nil {
		c.logger.Println(err)
	}
}
