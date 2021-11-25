package controllers

import (
	"log"
	"net/http"
)

type statusController struct {
	controller
	name    string
	version string
}

func NewStatusController(logger *log.Logger, name string, version string) *statusController {
	return &statusController{
		controller: newController(logger),
		name:       name,
		version:    version,
	}
}

type AppStatus struct {
	Name    string `json:"name"`
	Version string `json:"version"`
	Status  string `json:"status"`
}

func (c *statusController) GetStatus(w http.ResponseWriter, r *http.Request) {
	currentStatus := AppStatus{
		Name:    c.name,
		Version: c.version,
		Status:  "Available",
	}

	err := c.writeJson(w, http.StatusOK, currentStatus)
	if err != nil {
		c.logger.Println(err)
	}
}
