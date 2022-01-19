package controllers

import (
	"encoding/json"
	"erm_backend/internal/models"
	"fmt"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

type authenticationController struct {
	controller
	jwtSecret string
}

func NewAuthenticationController(logger *log.Logger, jwtSecret string) *authenticationController {
	return &authenticationController{
		controller: newController(logger),
		jwtSecret:  jwtSecret,
	}
}

var validUser = models.User{
	ID:       1,
	Email:    "admin@admin.com",
	Password: "$2a$12$OFjTdVVs//MJ7uPrnNA5wON5.cR3yQqikVvqwhAU3moX2vUzImMBa",
	IsActive: true,
}

type Credentials struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

type AuthenticatedUser struct {
	User models.User `json:"user"`
	Jwt  []byte      `json:"jwt"`
}

func (c *authenticationController) SignIn(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		c.writeWrappedErrorJson(w, err, 400)
		return
	}

	hashedPassword := validUser.Password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password))
	if err != nil {
		c.writeWrappedErrorJson(w, err, 400)
		return
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprint(validUser.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "erm.com"
	claims.Audiences = []string{"erm.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(c.jwtSecret))
	if err != nil {
		c.writeWrappedErrorJson(w, err, 400)
		return
	}

	var authenticatedUser = &AuthenticatedUser{
		User: validUser,
		Jwt:  jwtBytes,
	}

	err = c.writeWrappedJson(w, http.StatusOK, authenticatedUser, "result")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *authenticationController) SignUp(w http.ResponseWriter, r *http.Request) {
	err := c.writeWrappedJson(w, http.StatusOK, nil, "result")
	if err != nil {
		c.logger.Println(err)
	}
}
