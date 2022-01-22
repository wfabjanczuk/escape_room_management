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

type userController struct {
	controller
	userRepository *repositories.UserRepository
}

func newUserController(logger *log.Logger, userRepository *repositories.UserRepository) *userController {
	return &userController{
		controller:     newController(logger),
		userRepository: userRepository,
	}
}

func (c *userController) GetUser(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	user, err := c.userRepository.GetUser(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, user, "user")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *userController) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.userRepository.GetUsers()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, users, "users")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *userController) CreateUser(w http.ResponseWriter, r *http.Request) {
	c.handleSaveUser(w, r, false, false)
}

func (c *userController) UpdateUser(w http.ResponseWriter, r *http.Request) {
	c.handleSaveUser(w, r, true, false)
}

func (c *userController) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	c.handleSaveUser(w, r, true, true)
}

func (c *userController) DeleteUser(w http.ResponseWriter, r *http.Request) {
	deleteError := &responses.DeleteError{}
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	c.userRepository.DeleteUser(id, deleteError)
	if deleteError.ErrorsCount > 0 {
		err = c.writeWrappedJson(w, deleteError.StatusCode, deleteError, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	c.writeEmptyResponse(w, http.StatusOK)
}

func (c *userController) handleSaveUser(w http.ResponseWriter, r *http.Request, parseId, isProfile bool) {
	userErrors := &responses.UserErrors{}
	user := parsers.ParseUserFromRequest(r, parseId, isProfile, userErrors)

	if userErrors.ErrorsCount == 0 {
		user = c.userRepository.SaveUser(user, userErrors, isProfile)
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

func (c *userController) GetUserGuest(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	user, err := c.userRepository.GetUser(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	guest, err := c.userRepository.GetUserGuest(int(user.ID))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, guest, "guest")
	if err != nil {
		c.logger.Println(err)
	}
}
