package repositories

import (
	"gorm.io/gorm"
	"log"
)

type repository struct {
	logger *log.Logger
	db     *gorm.DB
}
