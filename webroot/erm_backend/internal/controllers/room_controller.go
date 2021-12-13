package controllers

import (
	"erm_backend/internal/repositories"
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
