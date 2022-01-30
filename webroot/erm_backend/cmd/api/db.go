package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

func getDbConnection(cfg config) *gorm.DB {
	if cfg.env == "development" {
		return openDevDbConnection(cfg.dsn)
	}

	return openDbConnection(cfg.dsn)
}

func openDbConnection(dsn string) *gorm.DB {
	db, err := gorm.Open(postgres.Open(dsn))
	if err != nil {
		log.Fatal("Could not establish DB connection")
	}

	return db
}

func openDevDbConnection(dsn string) *gorm.DB {
	var db *gorm.DB
	var err error
	maxDevRetries := 10 // in case erm_backend container is ready before erm_database container, see docker-compose.yml
	retryInterval := 10 * time.Second

	log.Println(fmt.Sprintf("Trying to open dev DB connection. Max retries: %d", maxDevRetries))

	for i := 1; i <= maxDevRetries; i++ {
		log.Println(fmt.Sprintf("Opening dev DB connection attempt %d", i))

		db, err = gorm.Open(postgres.Open(dsn))
		if err == nil {
			log.Println("Dev DB connection successfully opened.")
			return db
		}

		time.Sleep(retryInterval)
	}

	log.Fatal("Could not open dev DB connection: ", err)
	return db
}

func (app *application) resetDevDatabase() *application {
	data, err := os.ReadFile("/usr/local/go/src/app/scripts/reset_dev_database.sql")
	if err != nil {
		log.Fatal("Could not read reset_dev_database script")
	}

	log.Println("Starting reset_dev_database script")

	result := app.db.Exec(string(data))
	if result.Error != nil {
		log.Fatal(result.Error.Error())
	}

	log.Println("Successfully executed reset_dev_database script")

	return app
}
