package controllers

import (
	"erm_backend/internal/repositories"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strconv"
)

type ticketController struct {
	controller
	ticketRepository *repositories.TicketRepository
}

func NewTicketController(logger *log.Logger, ticketRepository *repositories.TicketRepository) *ticketController {
	return &ticketController{
		controller:       newController(logger),
		ticketRepository: ticketRepository,
	}
}

func (c *ticketController) GetTicket(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusBadRequest)
		return
	}

	ticket, err := c.ticketRepository.GetTicket(id)
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusNotFound)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, ticket, "ticket")
	if err != nil {
		c.logger.Println(err)
	}
}

func (c *ticketController) GetTickets(w http.ResponseWriter, r *http.Request) {
	tickets, err := c.ticketRepository.GetTickets()
	if err != nil {
		c.writeWrappedErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	err = c.writeWrappedJson(w, http.StatusOK, tickets, "tickets")
	if err != nil {
		c.logger.Println(err)
	}
}
