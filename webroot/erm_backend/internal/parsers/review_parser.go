package parsers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/responses"
	"github.com/asaskevich/govalidator"
	"net/http"
	"strconv"
)

func ParseReviewFromRequest(r *http.Request, parseId bool, reviewErrors *responses.ReviewErrors) models.Review {
	var reviewPayload payloads.ReviewPayload
	var review models.Review

	err := json.NewDecoder(r.Body).Decode(&reviewPayload)
	if err != nil {
		reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		return review
	}

	review = extractReview(reviewPayload, parseId, reviewErrors)
	validateReview(review, parseId, reviewErrors)

	return review
}

func extractReview(payload payloads.ReviewPayload, parseId bool, reviewErrors *responses.ReviewErrors) models.Review {
	var review models.Review

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
		}

		review.ID = uint(id)
	}

	guestId, err := strconv.Atoi(payload.GuestID)
	if err != nil {
		reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}
	review.GuestID = uint(guestId)

	roomId, err := strconv.Atoi(payload.RoomID)
	if err != nil {
		reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}
	review.RoomID = uint(roomId)

	rating, err := strconv.Atoi(payload.Rating)
	if err != nil {
		reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}
	review.Rating = uint(rating)

	review.Comment = payload.Comment
	review.Reply = payload.Reply

	return review
}

func validateReview(review models.Review, parseId bool, reviewErrors *responses.ReviewErrors) {
	result, err := govalidator.ValidateStruct(review)
	if !result {
		parseStructError(err, reviewErrors)
	}

	if parseId && review.ID < 1 {
		reviewErrors.AddError("", "Invalid form data.", http.StatusBadRequest)
	}

	if review.Rating < 0 || review.Rating > 5 {
		reviewErrors.AddError("rating", "This number must be from 0 to 5.", http.StatusBadRequest)
	}
}
