package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

type config struct {
	port int
	env  string
	dsn  string
}

type application struct {
	config config
	logger *log.Logger
	db     *gorm.DB
}

func newApplication() *application {
	cfg := getConfigFromEnv()

	return &application{
		config: cfg,
		logger: log.New(os.Stdout, "", log.Ldate|log.Ltime),
		db:     openLocalDbConnection(cfg.dsn),
	}
}

func (app *application) start() {
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.config.port),
		Handler:      app.getRouter(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	app.logger.Printf("Starting %s server on port %d", app.config.env, app.config.port)

	err := srv.ListenAndServe()
	if err != nil {
		app.logger.Println(err)
	}
}

func getConfigFromEnv() config {
	var cfg config

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	cfg.dsn = os.Getenv("DSN")
	if cfg.dsn == "" {
		log.Fatal("Error loading DSN from .env file")
	}

	cfg.port, _ = strconv.Atoi(os.Getenv("PORT"))
	if cfg.port == 0 {
		cfg.port = 9000
	}

	cfg.env = os.Getenv("ENV")
	if cfg.env == "" {
		cfg.env = "development"
	}

	return cfg
}

func openDbConnection(dsn string) *gorm.DB {
	db, err := gorm.Open(postgres.Open(dsn))
	if err != nil {
		log.Fatal("Could not establish DB connection")
	}

	return db
}

func openLocalDbConnection(dsn string) *gorm.DB {
	var db *gorm.DB
	var err error
	maxRetries := 10

	log.Println(fmt.Sprintf("Trying to open local DB connection. Max retries: %d", maxRetries))

	for i := 1; i <= maxRetries; i++ {
		log.Println(fmt.Sprintf("Opening local DB connection attempt %d", i))
		db, err = gorm.Open(postgres.Open(dsn))
		if err == nil {
			log.Println("Local DB connection successfully opened.")
			return db
		}
		time.Sleep(10 * time.Second)
	}

	log.Println(err)
	log.Fatal("Could not open local DB connection.")
	return db
}
