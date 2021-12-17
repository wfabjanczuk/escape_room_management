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

type roomController struct {
	controller
	roomRepository *repositories.RoomRepository
}

func NewRoomController(logger *log.Logger, roomRepository *repositories.RoomRepository) *roomController {
	return &roomController{
		controller:     newController(logger),
		roomRepository: roomRepository,
	}
}

func (c *roomController) GetRoom(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	room, err := c.roomRepository.GetRoom(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, room, "room")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *roomController) GetRoomReservations(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	reservations, err := c.roomRepository.GetRoomReservations(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, reservations, "reservations")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *roomController) GetRooms(w http.ResponseWriter, r *http.Request) {
	rooms, err := c.roomRepository.GetRooms()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, rooms, "rooms")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *roomController) CreateRoom(w http.ResponseWriter, r *http.Request) {
	c.handleSaveRoom(w, r, false)
}

func (c *roomController) UpdateRoom(w http.ResponseWriter, r *http.Request) {
	c.handleSaveRoom(w, r, true)
}

func (c *roomController) DeleteRoom(w http.ResponseWriter, r *http.Request) {
	deleteError := &responses.DeleteError{}
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	c.roomRepository.DeleteRoom(id, deleteError)
	if deleteError.ErrorsCount > 0 {
		err = c.writeWrappedJson(w, deleteError.StatusCode, deleteError, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	c.writeEmptyResponse(w, http.StatusOK)
}

func (c *roomController) handleSaveRoom(w http.ResponseWriter, r *http.Request, parseId bool) {
	roomErrors := &responses.RoomErrors{}
	room := parsers.ParseRoomFromRequest(r, parseId, roomErrors)

	if roomErrors.ErrorsCount == 0 {
		c.roomRepository.SaveRoom(room, roomErrors)
	}

	if roomErrors.ErrorsCount > 0 {
		err := c.writeWrappedJson(w, roomErrors.StatusCode, roomErrors, "error")
		if err != nil {
			c.logger.Println(err)
		}

		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, room, "room")
	if err != nil {
		c.logger.Println(err)
	}
}
