package routing

import "net/http"

const v = "/v1"

func (s *Service) setRoutes() {
	s.setStatusRoutes()
	s.setAuthRoutes()
	s.setUserRoutes()
	s.setGuestRoutes()
	s.setTicketRoutes()
	s.setReservationRoutes()
	s.setRoomRoutes()
	s.setReviewRoutes()
}

func (s *Service) setStatusRoutes() {
	s.router.HandlerFunc(http.MethodGet, "/", s.controllersTable.Status.GetStatus)
}

func (s *Service) setAuthRoutes() {
	s.router.HandlerFunc(http.MethodPost, v+"/signin", s.controllersTable.Auth.SignIn)
}

func (s *Service) setUserRoutes() {
	s.router.GET(v+"/users", s.withAdminAuthorization(s.controllersTable.User.GetUsers))
	s.router.POST(v+"/users", s.withAdminAuthorization(s.controllersTable.User.CreateUser))
	s.router.GET(v+"/users/:id", s.withAdminAuthorization(s.controllersTable.User.GetUser))
	s.router.PUT(v+"/users/:id", s.withAdminOrUserMatchesUserIdAuthorization(s.controllersTable.User.UpdateUser))
	s.router.DELETE(v+"/users/:id", s.withAdminAuthorization(s.controllersTable.User.DeleteUser))
	s.router.GET(v+"/users/:id/guest", s.withAdminAuthorization(s.controllersTable.User.GetUserGuest))
}

func (s *Service) setGuestRoutes() {
	s.router.GET(v+"/guests", s.withAdminAuthorization(s.controllersTable.Guest.GetGuests))
	s.router.POST(v+"/guests", s.withAdminAuthorization(s.controllersTable.Guest.CreateGuest))
	s.router.GET(v+"/guests/:id", s.withAdminAuthorization(s.controllersTable.Guest.GetGuest))
	s.router.PUT(v+"/guests/:id", s.withAdminAuthorization(s.controllersTable.Guest.UpdateGuest))
	s.router.DELETE(v+"/guests/:id", s.withAdminAuthorization(s.controllersTable.Guest.DeleteGuest))
	s.router.GET(v+"/guests/:id/tickets", s.withAdminOrGuestMatchesGuestIdAuthorization(s.controllersTable.Guest.GetGuestTickets))

	s.router.HandlerFunc(http.MethodPost, v+"/guests/signup", s.controllersTable.Guest.SignUp)
}

func (s *Service) setTicketRoutes() {
	s.router.GET(v+"/tickets", s.withAdminAuthorization(s.controllersTable.Ticket.GetTickets))
	s.router.POST(v+"/tickets", s.withAdminAuthorization(s.controllersTable.Ticket.CreateTicket))
	s.router.GET(v+"/tickets/:id", s.withAdminAuthorization(s.controllersTable.Ticket.GetTicket))
	s.router.PUT(v+"/tickets/:id", s.withAdminAuthorization(s.controllersTable.Ticket.UpdateTicket))
	s.router.DELETE(v+"/tickets/:id", s.withAdminAuthorization(s.controllersTable.Ticket.DeleteTicket))
}

func (s *Service) setReservationRoutes() {
	s.router.GET(v+"/reservations", s.withAdminAuthorization(s.controllersTable.Reservation.GetReservations))
	s.router.POST(v+"/reservations", s.withAdminAuthorization(s.controllersTable.Reservation.CreateReservation))
	s.router.GET(v+"/reservations/:id", s.withAdminOrGuestMatchesReservationIdAuthorization(s.controllersTable.Reservation.GetReservation))
	s.router.PUT(v+"/reservations/:id", s.withAdminAuthorization(s.controllersTable.Reservation.UpdateReservation))
	s.router.DELETE(v+"/reservations/:id", s.withAdminAuthorization(s.controllersTable.Reservation.DeleteReservation))
	s.router.PATCH(v+"/reservations/:id/cancel", s.withAdminOrGuestAllowedToCancelReservationAuthorization(s.controllersTable.Reservation.CancelReservation))
	s.router.GET(v+"/reservations/:id/tickets", s.withAdminOrGuestMatchesReservationIdAuthorization(s.controllersTable.Reservation.GetReservationTickets))
}

func (s *Service) setRoomRoutes() {
	s.router.HandlerFunc(http.MethodGet, v+"/rooms", s.controllersTable.Room.GetRooms)
	s.router.HandlerFunc(http.MethodGet, v+"/rooms/:id", s.controllersTable.Room.GetRoom)

	s.router.POST(v+"/rooms", s.withAdminAuthorization(s.controllersTable.Room.CreateRoom))
	s.router.PUT(v+"/rooms/:id", s.withAdminAuthorization(s.controllersTable.Room.UpdateRoom))
	s.router.DELETE(v+"/rooms/:id", s.withAdminAuthorization(s.controllersTable.Room.DeleteRoom))
	s.router.GET(v+"/rooms/:id/reservations", s.withAdminAuthorization(s.controllersTable.Room.GetRoomReservations))
}

func (s *Service) setReviewRoutes() {
	s.router.GET(v+"/reviews", s.withAdminAuthorization(s.controllersTable.Review.GetReviews))
	s.router.GET(v+"/reviews/:id", s.withAdminAuthorization(s.controllersTable.Review.GetReview))
}
