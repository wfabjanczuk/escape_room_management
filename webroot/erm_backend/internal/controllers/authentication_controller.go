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
	Password: "$2a$12$cdVUgQp0M7s8RQ2lsRCVPuUlcaFb6NuQbme.APdIUbWPyunE8i3bG",
}

type Credentials struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

func (c *authenticationController) Signin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		c.writeWrappedErrorJson(w, err, 400)
	}

	hashedPassword := validUser.Password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password))
	if err != nil {
		c.writeWrappedErrorJson(w, err, 400)
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprint(validUser.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "mydomain.com"
	claims.Audiences = []string{"mydomain.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(c.jwtSecret))
	if err != nil {
		c.writeWrappedErrorJson(w, err, 400)
	}

	err = c.writeWrappedJson(w, http.StatusOK, jwtBytes, "response")
	if err != nil {
		c.logger.Println(err)
	}
}
