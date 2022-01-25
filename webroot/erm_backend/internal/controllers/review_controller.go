package controllers

import (
	"erm_backend/internal/parsers"
	"erm_backend/internal/repositories"
	"erm_backend/internal/responses"
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

func (c *reviewController) CreateReview(w http.ResponseWriter, r *http.Request) {
	c.handleSaveReview(w, r, false)
}

func (c *reviewController) UpdateReview(w http.ResponseWriter, r *http.Request) {
	c.handleSaveReview(w, r, true)
}

func (c *reviewController) DeleteReview(w http.ResponseWriter, r *http.Request) {
	deleteError := &responses.DeleteError{}
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	c.reviewRepository.DeleteReview(id, deleteError)
	if deleteError.ErrorsCount > 0 {
		err = c.writeWrappedJson(w, deleteError.StatusCode, deleteError, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	c.writeEmptyResponse(w, http.StatusOK)
}

func (c *reviewController) handleSaveReview(w http.ResponseWriter, r *http.Request, parseId bool) {
	reviewErrors := &responses.ReviewErrors{}
	review := parsers.ParseReviewFromRequest(r, parseId, reviewErrors)
	params := httprouter.ParamsFromContext(r.Context())

	if parseId {
		id, err := strconv.Atoi(params.ByName("id"))

		if err != nil || int(review.ID) != id {
			reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}
	}

	if reviewErrors.ErrorsCount == 0 {
		review = c.reviewRepository.SaveReview(review, reviewErrors)
	}

	if reviewErrors.ErrorsCount > 0 {
		err := c.writeWrappedJson(w, reviewErrors.StatusCode, reviewErrors, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, review, "review")
	if err != nil {
		c.logger.Println(err)
	}
}
