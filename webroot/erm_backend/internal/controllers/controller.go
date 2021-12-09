package controllers

import (
	"encoding/json"
	"log"
	"net/http"
)

type controller struct {
	logger *log.Logger
}

func newController(logger *log.Logger) controller {
	return controller{
		logger: logger,
	}
}

type encapsulatedMessage struct {
	Message string `json:"message"`
}

func (c *controller) writeEmptyResponse(w http.ResponseWriter, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
}

func (c *controller) writeJson(w http.ResponseWriter, statusCode int, data interface{}) error {
	output, err := json.Marshal(data)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	_, err = w.Write(output)
	if err != nil {
		c.logger.Println(err)
		return nil
	}

	c.logger.Println(data)

	return nil
}

func (c *controller) writeWrappedJson(w http.ResponseWriter, statusCode int, data interface{}, wrap string) error {
	wrapper := make(map[string]interface{})
	wrapper[wrap] = data

	return c.writeJson(w, statusCode, wrapper)
}

func (c *controller) writeWrappedErrorJson(w http.ResponseWriter, error error, status int) {
	errorData := encapsulatedMessage{
		Message: error.Error(),
	}

	err := c.writeWrappedJson(w, status, errorData, "error")
	if err != nil {
		c.logger.Println(err)
	}
}
