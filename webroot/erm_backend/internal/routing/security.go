package routing

import (
	"context"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"net/http"
)

func (s *Service) withAuthentication(fn http.HandlerFunc) httprouter.Handle {
	return s.wrapHandler(s.authenticationChain.ThenFunc(fn))
}

func (s *Service) withAuthorization(fn http.HandlerFunc, allowedRoles []int) httprouter.Handle {
	return s.wrapHandler(alice.New(s.prepareAuthorize(allowedRoles)).ThenFunc(fn))
}

func (s *Service) wrapHandler(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		ctx := context.WithValue(r.Context(), httprouter.ParamsKey, params)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
