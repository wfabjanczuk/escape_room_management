package routing

import (
	"net/http"
)

func (s *Service) enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, PATCH, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		next.ServeHTTP(w, r)
	})
}

func (s *Service) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := s.controllersTable.Auth.HandleAuthentication(w, r)

		if user.ID == 0 {
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *Service) prepareAuthorize(allowedRoles []int) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !s.controllersTable.Auth.HandleAuthorization(w, r, allowedRoles) {
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
