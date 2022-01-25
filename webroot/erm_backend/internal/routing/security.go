package routing

import (
	"context"
	"erm_backend/internal/constants"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"net/http"
)

func (s *Service) withAdminOrUserMatchesUserIdAuthorization(fn http.HandlerFunc) httprouter.Handle {
	adminRole := []int{constants.RoleAdmin}
	rules := []string{constants.RuleUserMatchesUserId}

	return s.wrapHandler(alice.New(s.prepareAuthorize(adminRole, rules)).ThenFunc(fn))
}

func (s *Service) withAdminOrGuestMatchesGuestIdAuthorization(fn http.HandlerFunc) httprouter.Handle {
	adminRole := []int{constants.RoleAdmin}
	rules := []string{constants.RuleGuestMatchesGuestId}

	return s.wrapHandler(alice.New(s.prepareAuthorize(adminRole, rules)).ThenFunc(fn))
}

func (s *Service) withAdminOrGuestMatchesReservationIdAuthorization(fn http.HandlerFunc) httprouter.Handle {
	adminRole := []int{constants.RoleAdmin}
	rules := []string{constants.RuleGuestMatchesReservationId}

	return s.wrapHandler(alice.New(s.prepareAuthorize(adminRole, rules)).ThenFunc(fn))
}

func (s *Service) withAdminOrGuestMatchesReviewIdAuthorization(fn http.HandlerFunc) httprouter.Handle {
	adminRole := []int{constants.RoleAdmin}
	rules := []string{constants.RuleGuestMatchesReviewId}

	return s.wrapHandler(alice.New(s.prepareAuthorize(adminRole, rules)).ThenFunc(fn))
}

func (s *Service) withAdminOrGuestAllowedToCancelReservationAuthorization(fn http.HandlerFunc) httprouter.Handle {
	adminRole := []int{constants.RoleAdmin}
	rules := []string{constants.RuleGuestAllowedToCancelReservation}

	return s.wrapHandler(alice.New(s.prepareAuthorize(adminRole, rules)).ThenFunc(fn))
}

func (s *Service) withAdminAuthorization(fn http.HandlerFunc) httprouter.Handle {
	adminRole := []int{constants.RoleAdmin}

	return s.wrapHandler(alice.New(s.prepareAuthorize(adminRole, []string{})).ThenFunc(fn))
}

func (s *Service) wrapHandler(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		ctx := context.WithValue(r.Context(), httprouter.ParamsKey, params)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
