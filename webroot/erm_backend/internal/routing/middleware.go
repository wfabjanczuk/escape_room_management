package routing

import (
	"context"
	"erm_backend/internal/controllers"
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

func (s *Service) prepareAuthorize(allowedRoles []int, rules []string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			result, user, guest := s.controllersTable.Auth.Authorize(w, r, allowedRoles, rules)
			if !result {
				return
			}

			ctx := context.WithValue(r.Context(), controllers.ParamsUserKey, user)
			ctx = context.WithValue(ctx, controllers.ParamsGuestKey, guest)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
