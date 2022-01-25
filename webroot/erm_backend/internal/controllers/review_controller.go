package controllers

import (
	"erm_backend/internal/repositories"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strconv"
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

func (c *reviewController) GetReview(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	review, err := c.reviewRepository.GetReview(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, review, "review")
	if err != nil {
		c.logger.Println(err)
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
