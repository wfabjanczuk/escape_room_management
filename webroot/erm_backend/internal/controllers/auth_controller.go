package controllers

import (
	"bytes"
	"encoding/json"
	"erm_backend/internal/constants"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/repositories"
	"errors"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type authController struct {
	controller
	userRepository        *repositories.UserRepository
	reservationRepository *repositories.ReservationRepository
	reviewRepository      *repositories.ReviewRepository
	jwtSecret             string
}

type AuthenticatedUser struct {
	User    models.User `json:"user"`
	GuestId uint        `json:"guestId"`
	Jwt     string      `json:"jwt"`
}

func newAuthController(userRepository *repositories.UserRepository, reservationRepository *repositories.ReservationRepository, reviewRepository *repositories.ReviewRepository, jwtSecret string, logger *log.Logger) *authController {
	return &authController{
		controller:            newController(logger),
		userRepository:        userRepository,
		reservationRepository: reservationRepository,
		reviewRepository:      reviewRepository,
		jwtSecret:             jwtSecret,
	}
}

func (c *authController) SignIn(w http.ResponseWriter, r *http.Request) {
	var payload payloads.SignInPayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	user, err := c.userRepository.GetActiveUserByEmail(payload.Email)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	hashedPassword := user.Password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(payload.Password))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprint(user.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "erm.com"
	claims.Audiences = []string{"erm.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(c.jwtSecret))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	var guestId uint
	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err == nil {
		guestId = guest.ID
	}

	user.Password = ""
	var authenticatedUser = &AuthenticatedUser{
		User:    user,
		GuestId: guestId,
		Jwt:     string(jwtBytes),
	}

	err = c.writeWrappedJson(w, http.StatusOK, authenticatedUser, "result")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *authController) Authenticate(w http.ResponseWriter, r *http.Request) (models.User, models.Guest) {
	w.Header().Add("Vary", "Authorization")

	user, guest, err := c.validateAuthorizationHeader(r.Header.Get("Authorization"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusUnauthorized)
	}

	return user, guest
}

func (c *authController) validateAuthorizationHeader(authorizationHeader string) (models.User, models.Guest, error) {
	var user models.User
	var guest models.Guest
	headerParts := strings.Split(authorizationHeader, " ")

	if len(headerParts) != 2 {
		return user, guest, errors.New("invalid authorization header")
	}

	if headerParts[0] != "Bearer" {
		return user, guest, errors.New("bearer authorization required")
	}

	token := headerParts[1]
	claims, err := jwt.HMACCheck([]byte(token), []byte(c.jwtSecret))
	if err != nil {
		return user, guest, errors.New("failed HMAC check")
	}

	if !claims.Valid(time.Now()) {
		return user, guest, errors.New("token expired")
	}

	if !claims.AcceptAudience("erm.com") {
		return user, guest, errors.New("invalid audience")
	}

	if claims.Issuer != "erm.com" {
		return user, guest, errors.New("invalid issuer")
	}

	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		return user, guest, errors.New("invalid token format")
	}

	user, err = c.userRepository.GetUser(int(userId))
	if err != nil {
		return user, guest, errors.New("user not found")
	}

	if user.RoleID == constants.RoleGuest {
		guest, err = c.userRepository.GetUserGuest(int(userId))
		if err != nil {
			return user, guest, errors.New("guest not found")
		}
	}

	return user, guest, nil
}

func (c *authController) Authorize(w http.ResponseWriter, r *http.Request, allowedRoles []int, rules []string) (bool, models.User, models.Guest) {
	user, guest := c.Authenticate(w, r)

	if user.ID == 0 {
		return false, user, guest
	}

	for _, roleId := range allowedRoles {
		if user.RoleID == uint(roleId) {
			return true, user, guest
		}
	}

	if c.validateRules(r, user, rules) {
		return true, user, guest
	}

	errorData := map[string][]string{
		"general": {"Not authorized."},
	}
	err := c.writeWrappedJson(w, http.StatusUnauthorized, errorData, "error")
	if err != nil {
		c.logger.Println(err)
	}

	return false, user, guest
}

func (c *authController) validateRules(r *http.Request, user models.User, rules []string) bool {
	if len(rules) == 0 {
		return false
	}

	for _, ruleName := range rules {
		if c.validateRule(r, user, ruleName) {
			return true
		}
	}

	return false
}

func (c *authController) validateRule(r *http.Request, user models.User, ruleName string) bool {
	switch ruleName {
	case constants.RuleUserMatchesUserId:
		return c.validateUserMatchesUserId(r, user)
	case constants.RuleGuestMatchesGuestId:
		return c.validateGuestMatchesGuestId(r, user)
	case constants.RuleGuestMatchesFormGuestId:
		return c.validateGuestMatchesFormGuestId(r, user)
	case constants.RuleGuestMatchesReservationId:
		return c.validateGuestMatchesReservationId(r, user)
	case constants.RuleGuestMatchesReviewId:
		return c.validateGuestMatchesReviewId(r, user)
	case constants.RuleGuestAllowedToCancelReservation:
		return c.validateGuestAllowedToCancelReservation(r, user)
	}
	return false
}

func (c *authController) validateUserMatchesUserId(r *http.Request, user models.User) bool {
	params := httprouter.ParamsFromContext(r.Context())

	userId, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		return false
	}

	return userId == int(user.ID)
}

func (c *authController) validateGuestMatchesGuestId(r *http.Request, user models.User) bool {
	if user.RoleID != constants.RoleGuest {
		return false
	}

	params := httprouter.ParamsFromContext(r.Context())

	guestId, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		return false
	}

	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err != nil {
		return false
	}

	return guestId == int(guest.ID)
}

func (c *authController) validateGuestMatchesFormGuestId(r *http.Request, user models.User) bool {
	var reviewPayload payloads.ReviewPayload
	var body []byte

	if user.RoleID != constants.RoleGuest {
		return false
	}

	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err != nil {
		return false
	}

	if r.Body != nil {
		body, _ = ioutil.ReadAll(r.Body)
	}

	r.Body = ioutil.NopCloser(bytes.NewBuffer(body))
	err = json.NewDecoder(bytes.NewReader(body)).Decode(&reviewPayload)
	if err != nil {
		return false
	}

	guestId, err := strconv.Atoi(reviewPayload.GuestID)
	if err != nil {
		return false
	}

	return guestId == int(guest.ID)
}

func (c *authController) validateGuestMatchesReservationId(r *http.Request, user models.User) bool {
	if user.RoleID != constants.RoleGuest {
		return false
	}

	params := httprouter.ParamsFromContext(r.Context())

	reservationId, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		return false
	}

	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err != nil {
		return false
	}

	return c.reservationRepository.IsGuestInReservation(int(guest.ID), reservationId)
}

func (c *authController) validateGuestMatchesReviewId(r *http.Request, user models.User) bool {
	if user.RoleID != constants.RoleGuest {
		return false
	}

	params := httprouter.ParamsFromContext(r.Context())

	reviewId, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		return false
	}

	review, err := c.reviewRepository.GetReview(reviewId)
	if err != nil {
		return false
	}

	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err != nil {
		return false
	}

	return review.GuestID == guest.ID
}

func (c *authController) validateGuestAllowedToCancelReservation(r *http.Request, user models.User) bool {
	if user.RoleID != constants.RoleGuest {
		return false
	}

	params := httprouter.ParamsFromContext(r.Context())

	reservationId, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		return false
	}

	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err != nil {
		return false
	}

	return c.reservationRepository.CanGuestCancelReservation(int(guest.ID), reservationId)
}
