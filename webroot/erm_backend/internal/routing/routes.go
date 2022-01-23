package routing

import (
	"erm_backend/internal/constants"
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
	admin := []int{constants.RoleAdmin}

	s.router.GET(v+"/users", s.withAuthorization(s.controllersTable.User.GetUsers, admin))
	s.router.POST(v+"/users", s.withAuthorization(s.controllersTable.User.CreateUser, admin))
	s.router.GET(v+"/users/:id", s.withAuthorization(s.controllersTable.User.GetUser, admin))
	s.router.PUT(v+"/users/:id", s.withAuthentication(s.controllersTable.User.UpdateUser))
	s.router.DELETE(v+"/users/:id", s.withAuthorization(s.controllersTable.User.DeleteUser, admin))
	s.router.GET(v+"/users/:id/guest", s.withAuthorization(s.controllersTable.User.GetUserGuest, admin))
}

func (s *Service) setGuestRoutes() {
	admin := []int{constants.RoleAdmin}

	s.router.GET(v+"/guests", s.withAuthorization(s.controllersTable.Guest.GetGuests, admin))
	s.router.POST(v+"/guests", s.withAuthorization(s.controllersTable.Guest.CreateGuest, admin))
	s.router.GET(v+"/guests/:id", s.withAuthorization(s.controllersTable.Guest.GetGuest, admin))
	s.router.PUT(v+"/guests/:id", s.withAuthorization(s.controllersTable.Guest.UpdateGuest, admin))
	s.router.DELETE(v+"/guests/:id", s.withAuthorization(s.controllersTable.Guest.DeleteGuest, admin))
	s.router.GET(v+"/guests/:id/tickets", s.withAuthentication(s.controllersTable.Guest.GetGuestTickets))

	s.router.HandlerFunc(http.MethodPost, v+"/guests/signup", s.controllersTable.Guest.SignUp)
}

func (s *Service) setTicketRoutes() {
	admin := []int{constants.RoleAdmin}

	s.router.GET(v+"/tickets", s.withAuthorization(s.controllersTable.Ticket.GetTickets, admin))
	s.router.POST(v+"/tickets", s.withAuthorization(s.controllersTable.Ticket.CreateTicket, admin))
	s.router.GET(v+"/tickets/:id", s.withAuthorization(s.controllersTable.Ticket.GetTicket, admin))
	s.router.PUT(v+"/tickets/:id", s.withAuthorization(s.controllersTable.Ticket.UpdateTicket, admin))
	s.router.DELETE(v+"/tickets/:id", s.withAuthorization(s.controllersTable.Ticket.DeleteTicket, admin))
}

func (s *Service) setReservationRoutes() {
	admin := []int{constants.RoleAdmin}

	s.router.GET(v+"/reservations", s.withAuthorization(s.controllersTable.Reservation.GetReservations, admin))
	s.router.POST(v+"/reservations", s.withAuthorization(s.controllersTable.Reservation.CreateReservation, admin))
	s.router.GET(v+"/reservations/:id", s.withAuthentication(s.controllersTable.Reservation.GetReservation))
	s.router.PUT(v+"/reservations/:id", s.withAuthorization(s.controllersTable.Reservation.UpdateReservation, admin))
	s.router.DELETE(v+"/reservations/:id", s.withAuthorization(s.controllersTable.Reservation.DeleteReservation, admin))
	s.router.PATCH(v+"/reservations/:id/cancel", s.withAuthentication(s.controllersTable.Reservation.CancelReservation))
	s.router.GET(v+"/reservations/:id/tickets", s.withAuthentication(s.controllersTable.Reservation.GetReservationTickets))
}

func (s *Service) setRoomRoutes() {
	admin := []int{constants.RoleAdmin}

	s.router.HandlerFunc(http.MethodGet, v+"/rooms", s.controllersTable.Room.GetRooms)
	s.router.HandlerFunc(http.MethodGet, v+"/rooms/:id", s.controllersTable.Room.GetRoom)

	s.router.POST(v+"/rooms", s.withAuthorization(s.controllersTable.Room.CreateRoom, admin))
	s.router.PUT(v+"/rooms/:id", s.withAuthorization(s.controllersTable.Room.UpdateRoom, admin))
	s.router.DELETE(v+"/rooms/:id", s.withAuthorization(s.controllersTable.Room.DeleteRoom, admin))
	s.router.GET(v+"/rooms/:id/reservations", s.withAuthorization(s.controllersTable.Room.GetRoomReservations, admin))
}
