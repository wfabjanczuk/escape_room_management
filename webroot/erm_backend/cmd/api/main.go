package main

import (
	"database/sql"
	"flag"
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"time"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
}

type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type application struct {
	config config
	logger *log.Logger
	dsn    string
}

type Guest struct {
	Id              uint `gorm:"primarykey"`
	Email           string
	FirstName       string
	LastName        string
	PhoneNumber     string
	DateBirth       time.Time
	DiscountPercent sql.NullInt32
}

func (Guest) TableName() string {
	return "guest"
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 9000, "Server port to listen on")
	flag.StringVar(&cfg.env, "env", "development", "Application environment (development|production)")
	flag.Parse()

	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := os.Getenv("DSN")
	if dsn == "" {
		log.Fatal("Error loading DSN from .env file")
	}

	app := &application{
		config: cfg,
		logger: logger,
		dsn:    dsn,
	}

	db, err := gorm.Open(postgres.Open(app.dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database")
	}

	var guest Guest
	db.First(&guest, 1)
	app.logger.Println(guest.Email)
	app.logger.Println(guest.DiscountPercent)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.config.port),
		Handler:      app.getRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	app.logger.Printf("Starting %s server on port %d", cfg.env, cfg.port)

	err = srv.ListenAndServe()
	if err != nil {
		app.logger.Println(err)
	}
}
