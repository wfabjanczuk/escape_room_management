package main

import (
	"log"
	"os"
)

func (app *application) resetDatabase() *application {
	data, err := os.ReadFile("/usr/local/go/src/app/scripts/reset_database.sql")
	if err != nil {
		log.Fatal("Could not read reset_database script")
	}

	log.Println("Starting reset_database script")

	result := app.db.Exec(string(data))
	if result.Error != nil {
		log.Fatal(result.Error.Error())
	}

	log.Println("Successfully executed reset_database script")

	return app
}
