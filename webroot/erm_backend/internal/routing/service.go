package routing

import (
	"erm_backend/internal/controllers"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type Service struct {
	router           *httprouter.Router
	controllersTable controllers.Table
}

func (s *Service) GetHandler() http.Handler {
	return s.enableCors(s.router)
}

func NewService(controllersTable controllers.Table) *Service {
	routingService := &Service{
		router:           httprouter.New(),
		controllersTable: controllersTable,
	}
	routingService.setRoutes()

	return routingService
}
