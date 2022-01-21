package routing

import (
	"erm_backend/internal/controllers"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"net/http"
)

type Service struct {
	router              *httprouter.Router
	controllersTable    controllers.Table
	authenticationChain alice.Chain
}

func (s *Service) GetHandler() http.Handler {
	return s.enableCors(s.router)
}

func NewService(controllersTable controllers.Table) *Service {
	routingService := &Service{
		router:           httprouter.New(),
		controllersTable: controllersTable,
	}
	routingService.authenticationChain = alice.New(routingService.authenticate)
	routingService.setRoutes()

	return routingService
}
