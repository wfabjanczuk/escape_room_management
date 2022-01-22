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
	s.router.POST(v+"/users", s.withAuthentication(s.controllersTable.User.CreateUser))
	s.router.GET(v+"/users/:id", s.withAuthentication(s.controllersTable.User.GetUser))
	s.router.PUT(v+"/users/:id", s.withAuthentication(s.controllersTable.User.UpdateUser))
	s.router.DELETE(v+"/users/:id", s.withAuthentication(s.controllersTable.User.DeleteUser))
	s.router.GET(v+"/users/:id/guest", s.withAuthentication(s.controllersTable.User.GetUserGuest))
}

func (s *Service) setGuestRoutes() {
	s.router.GET(v+"/guests", s.withAuthentication(s.controllersTable.Guest.GetGuests))
	s.router.POST(v+"/guests", s.withAuthentication(s.controllersTable.Guest.CreateGuest))
	s.router.GET(v+"/guests/:id", s.withAuthentication(s.controllersTable.Guest.GetGuest))
	s.router.PUT(v+"/guests/:id", s.withAuthentication(s.controllersTable.Guest.UpdateGuest))
	s.router.DELETE(v+"/guests/:id", s.withAuthentication(s.controllersTable.Guest.DeleteGuest))
	s.router.GET(v+"/guests/:id/tickets", s.withAuthentication(s.controllersTable.Guest.GetGuestTickets))

	s.router.HandlerFunc(http.MethodPost, v+"/guests/signup", s.controllersTable.Guest.SignUp)
}

func (s *Service) setTicketRoutes() {
	s.router.GET(v+"/tickets", s.withAuthentication(s.controllersTable.Ticket.GetTickets))
	s.router.POST(v+"/tickets", s.withAuthentication(s.controllersTable.Ticket.CreateTicket))
	s.router.GET(v+"/tickets/:id", s.withAuthentication(s.controllersTable.Ticket.GetTicket))
	s.router.PUT(v+"/tickets/:id", s.withAuthentication(s.controllersTable.Ticket.UpdateTicket))
	s.router.DELETE(v+"/tickets/:id", s.withAuthentication(s.controllersTable.Ticket.DeleteTicket))
}

func (s *Service) setReservationRoutes() {
	s.router.GET(v+"/reservations", s.withAuthentication(s.controllersTable.Reservation.GetReservations))
	s.router.POST(v+"/reservations", s.withAuthentication(s.controllersTable.Reservation.CreateReservation))
	s.router.GET(v+"/reservations/:id", s.withAuthentication(s.controllersTable.Reservation.GetReservation))
	s.router.PUT(v+"/reservations/:id", s.withAuthentication(s.controllersTable.Reservation.UpdateReservation))
	s.router.DELETE(v+"/reservations/:id", s.withAuthentication(s.controllersTable.Reservation.DeleteReservation))
	s.router.GET(v+"/reservations/:id/tickets", s.withAuthentication(s.controllersTable.Reservation.GetReservationTickets))
}

func (s *Service) setRoomRoutes() {
	s.router.HandlerFunc(http.MethodGet, v+"/rooms", s.controllersTable.Room.GetRooms)
	s.router.HandlerFunc(http.MethodGet, v+"/rooms/:id", s.controllersTable.Room.GetRoom)

	s.router.POST(v+"/rooms", s.withAuthentication(s.controllersTable.Room.CreateRoom))
	s.router.PUT(v+"/rooms/:id", s.withAuthentication(s.controllersTable.Room.UpdateRoom))
	s.router.DELETE(v+"/rooms/:id", s.withAuthentication(s.controllersTable.Room.DeleteRoom))
	s.router.GET(v+"/rooms/:id/reservations", s.withAuthentication(s.controllersTable.Room.GetRoomReservations))
}

func (s *Service) withAuthentication(fn http.HandlerFunc) httprouter.Handle {
	return s.wrapHandler(s.authenticationChain.ThenFunc(fn))
}

func (s *Service) wrapHandler(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		ctx := context.WithValue(r.Context(), httprouter.ParamsKey, params)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
