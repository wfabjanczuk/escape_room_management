package controllers

import (
	"erm_backend/internal/models"
	"errors"
	"github.com/julienschmidt/httprouter"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
)

type ticketController struct {
	controller
	db *gorm.DB
}

func NewTicketController(logger *log.Logger, db *gorm.DB) *ticketController {
	return &ticketController{
		controller: newController(logger),
		db:         db,
	}
}

func (c *ticketController) GetTicket(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.logger.Println(errors.New("invalid id parameter"))
		c.writeWrappedErrorJson(w, err)
		return
	}

	var ticket models.Ticket
	result := c.db.Preload("Guest").Preload("Reservation").Preload("Reservation.Room").First(&ticket, id)
	if result.Error != nil {
		c.writeWrappedErrorJson(w, result.Error)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, ticket, "ticket")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *ticketController) GetTickets(w http.ResponseWriter, r *http.Request) {
	var tickets []models.Ticket
	result := c.db.Preload("Guest").Preload("Reservation").Preload("Reservation.Room").Find(&tickets)
	if result.Error != nil {
		c.writeWrappedErrorJson(w, result.Error)
		return
	}

	err := c.writeWrappedJson(w, http.StatusOK, tickets, "tickets")
	if err != nil {
		c.logger.Println(err)
	}
}
