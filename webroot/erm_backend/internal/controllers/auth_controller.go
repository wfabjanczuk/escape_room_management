package controllers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/payloads"
	"erm_backend/internal/repositories"
	"errors"
	"fmt"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type authController struct {
	controller
	userRepository *repositories.UserRepository
	jwtSecret      string
}

type AuthenticatedUser struct {
	User models.User `json:"user"`
	Jwt  string      `json:"jwt"`
}

func newAuthController(userRepository *repositories.UserRepository, jwtSecret string, logger *log.Logger) *authController {
	return &authController{
		controller:     newController(logger),
		userRepository: userRepository,
		jwtSecret:      jwtSecret,
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

	user.Password = ""
	var authenticatedUser = &AuthenticatedUser{
		User: user,
		Jwt:  string(jwtBytes),
	}

	err = c.writeWrappedJson(w, http.StatusOK, authenticatedUser, "result")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *authController) HandleAuthentication(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Add("Vary", "Authorization")

	err := c.validateAuthorizationHeader(r.Header.Get("Authorization"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusUnauthorized)
	}

	return err == nil
}

func (c *authController) validateAuthorizationHeader(authorizationHeader string) error {
	headerParts := strings.Split(authorizationHeader, " ")

	if len(headerParts) != 2 {
		return errors.New("invalid authorization header")
	}

	if headerParts[0] != "Bearer" {
		return errors.New("bearer authorization required")
	}

	token := headerParts[1]
	claims, err := jwt.HMACCheck([]byte(token), []byte(c.jwtSecret))
	if err != nil {
		return errors.New("failed HMAC check")
	}

	if !claims.Valid(time.Now()) {
		return errors.New("token expired")
	}

	if !claims.AcceptAudience("erm.com") {
		return errors.New("invalid audience")
	}

	if claims.Issuer != "erm.com" {
		return errors.New("invalid issuer")
	}

	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		return errors.New("invalid token format")
	}

	_, err = c.userRepository.GetUser(int(userId))
	if err != nil {
		return errors.New("user not found")
	}

	return nil
}
