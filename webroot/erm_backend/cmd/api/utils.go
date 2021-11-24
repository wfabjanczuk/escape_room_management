package main

import (
	"encoding/json"
	"net/http"
)

func (app *application) writeJson(w http.ResponseWriter, statusCode int, data interface{}, wrap string) error {
	wrapper := make(map[string]interface{})
	wrapper[wrap] = data

	output, err := json.Marshal(wrapper)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(output)

	return nil
}
