package repositories

import (
	"erm_backend/internal/models"
	"gorm.io/gorm"
	"log"
)

type UserRepository struct {
	repository
}

func NewUserRepository(logger *log.Logger, db *gorm.DB) *UserRepository {
	return &UserRepository{
		repository{
			logger: logger,
			db:     db,
		},
	}
}

func (r *UserRepository) GetActiveUserByEmail(email string) (models.User, error) {
	var user models.User
	result := r.db.Where("email = ? and is_active = ?", email, true).First(&user)

	return user, result.Error
}
