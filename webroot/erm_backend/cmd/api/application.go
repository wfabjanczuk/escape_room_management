package main

import (
	"erm_backend/internal/controllers"
	"erm_backend/internal/repositories"
	"erm_backend/internal/routing"
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

type config struct {
	port      int
	env       string
	dsn       string
	jwtSecret string
}

type application struct {
	config            config
	db                *gorm.DB
	logger            *log.Logger
	routingService    *routing.Service
	repositoriesTable repositories.Table
	controllersTable  controllers.Table
}

func newApplication() *application {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)
	cfg := getConfigFromEnv()
	db := getDbConnection(cfg)

	repositoriesTable := repositories.NewTable(logger, db)
	controllersTable := controllers.NewTable(repositoriesTable, logger, cfg.jwtSecret, apiName, apiVersion)
	routingService := routing.NewService(controllersTable)

	return &application{
		config:            cfg,
		db:                db,
		logger:            logger,
		repositoriesTable: repositoriesTable,
		controllersTable:  controllersTable,
		routingService:    routingService,
	}
}

func (app *application) start() {
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.config.port),
		Handler:      app.routingService.GetHandler(),
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

	cfg.jwtSecret = os.Getenv("JWT_SECRET")
	if cfg.jwtSecret == "" {
		log.Fatal("Error loading JWT_SECRET from .env file")
	}

	return cfg
}
