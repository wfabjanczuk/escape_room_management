package routing

import (
	"context"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

const v = "/v1"

func (s *Service) setRoutes() {
	s.setStatusRoutes()
	s.setAuthRoutes()
	s.setUserRoutes()
	s.setGuestRoutes()
	s.setTicketRoutes()
	s.setReservationRoutes()
	s.setRoomRoutes()
}

func (s *Service) setStatusRoutes() {
	s.router.HandlerFunc(http.MethodGet, "/", s.controllersTable.Status.GetStatus)
}

func (s *Service) setAuthRoutes() {
	s.router.HandlerFunc(http.MethodPost, v+"/signin", s.controllersTable.Auth.SignIn)
}

func (s *Service) setUserRoutes() {
	s.router.GET(v+"/users", s.withAuthentication(s.controllersTable.User.GetUsers))

	s.router.HandlerFunc(http.MethodPost, v+"/users", s.controllersTable.User.CreateUser)
	s.router.HandlerFunc(http.MethodGet, v+"/users/:id", s.controllersTable.User.GetUser)
	s.router.HandlerFunc(http.MethodPut, v+"/users/:id", s.controllersTable.User.UpdateUser)
	s.router.HandlerFunc(http.MethodDelete, v+"/users/:id", s.controllersTable.User.DeleteUser)
	s.router.HandlerFunc(http.MethodGet, v+"/users/:id/guest", s.controllersTable.User.GetUserGuest)
}

func (s *Service) setGuestRoutes() {
	s.router.HandlerFunc(http.MethodGet, v+"/guests", s.controllersTable.Guest.GetGuests)
	s.router.HandlerFunc(http.MethodPost, v+"/guests", s.controllersTable.Guest.CreateGuest)
	s.router.HandlerFunc(http.MethodGet, v+"/guests/:id", s.controllersTable.Guest.GetGuest)
	s.router.HandlerFunc(http.MethodPut, v+"/guests/:id", s.controllersTable.Guest.UpdateGuest)
	s.router.HandlerFunc(http.MethodDelete, v+"/guests/:id", s.controllersTable.Guest.DeleteGuest)
	s.router.HandlerFunc(http.MethodGet, v+"/guests/:id/tickets", s.controllersTable.Guest.GetGuestTickets)
	s.router.HandlerFunc(http.MethodPost, v+"/guests/signup", s.controllersTable.Guest.SignUp)
}

func (s *Service) setTicketRoutes() {
	s.router.HandlerFunc(http.MethodGet, v+"/tickets", s.controllersTable.Ticket.GetTickets)
	s.router.HandlerFunc(http.MethodPost, v+"/tickets", s.controllersTable.Ticket.CreateTicket)
	s.router.HandlerFunc(http.MethodGet, v+"/tickets/:id", s.controllersTable.Ticket.GetTicket)
	s.router.HandlerFunc(http.MethodPut, v+"/tickets/:id", s.controllersTable.Ticket.UpdateTicket)
	s.router.HandlerFunc(http.MethodDelete, v+"/tickets/:id", s.controllersTable.Ticket.DeleteTicket)
}

func (s *Service) setReservationRoutes() {
	s.router.HandlerFunc(http.MethodGet, v+"/reservations", s.controllersTable.Reservation.GetReservations)
	s.router.HandlerFunc(http.MethodPost, v+"/reservations", s.controllersTable.Reservation.CreateReservation)
	s.router.HandlerFunc(http.MethodGet, v+"/reservations/:id", s.controllersTable.Reservation.GetReservation)
	s.router.HandlerFunc(http.MethodPut, v+"/reservations/:id", s.controllersTable.Reservation.UpdateReservation)
	s.router.HandlerFunc(http.MethodDelete, v+"/reservations/:id", s.controllersTable.Reservation.DeleteReservation)
	s.router.HandlerFunc(http.MethodGet, v+"/reservations/:id/tickets", s.controllersTable.Reservation.GetReservationTickets)
}

func (s *Service) setRoomRoutes() {
	s.router.HandlerFunc(http.MethodGet, v+"/rooms", s.controllersTable.Room.GetRooms)
	s.router.HandlerFunc(http.MethodPost, v+"/rooms", s.controllersTable.Room.CreateRoom)
	s.router.HandlerFunc(http.MethodGet, v+"/rooms/:id", s.controllersTable.Room.GetRoom)
	s.router.HandlerFunc(http.MethodPut, v+"/rooms/:id", s.controllersTable.Room.UpdateRoom)
	s.router.HandlerFunc(http.MethodDelete, v+"/rooms/:id", s.controllersTable.Room.DeleteRoom)
	s.router.HandlerFunc(http.MethodGet, v+"/rooms/:id/reservations", s.controllersTable.Room.GetRoomReservations)
}

func (s *Service) withAuthentication(fn http.HandlerFunc) httprouter.Handle {
	return s.wrapHandler(s.authenticationChain.ThenFunc(fn))
}

func (s *Service) wrapHandler(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", params)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
