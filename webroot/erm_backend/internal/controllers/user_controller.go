package controllers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"erm_backend/internal/parsers"
	"erm_backend/internal/payloads"
	"erm_backend/internal/repositories"
	"erm_backend/internal/responses"
	"fmt"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

type AuthenticatedUser struct {
	User models.User `json:"user"`
	Jwt  []byte      `json:"jwt"`
}

type userController struct {
	controller
	jwtSecret      string
	userRepository *repositories.UserRepository
}

func NewUserController(logger *log.Logger, jwtSecret string, userRepository *repositories.UserRepository) *userController {
	return &userController{
		controller:     newController(logger),
		jwtSecret:      jwtSecret,
		userRepository: userRepository,
	}
}

func (c *userController) SignIn(w http.ResponseWriter, r *http.Request) {
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
		Jwt:  jwtBytes,
	}

	err = c.writeWrappedJson(w, http.StatusOK, authenticatedUser, "result")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *userController) CreateUser(w http.ResponseWriter, r *http.Request) {
	c.handleSaveUser(w, r, false)
}

func (c *userController) UpdateUser(w http.ResponseWriter, r *http.Request) {
	c.handleSaveUser(w, r, true)
}

func (c *userController) handleSaveUser(w http.ResponseWriter, r *http.Request, parseId bool) {
	userErrors := &responses.UserErrors{}
	user := parsers.ParseUserFromRequest(r, parseId, userErrors)

	if userErrors.ErrorsCount == 0 {
		user = c.userRepository.SaveUser(user, userErrors)
	}

	if userErrors.ErrorsCount > 0 {
		err := c.writeWrappedJson(w, userErrors.StatusCode, userErrors, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, user, "user")
	if err != nil {
		c.logger.Println(err)
	}
}
