package repositories

import (
	"database/sql"
	"erm_backend/internal/models"
	"erm_backend/internal/responses"
	"gorm.io/gorm"
	"log"
	"net/http"
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

func (r *UserRepository) GetUser(id int) (models.User, error) {
	var user models.User
	result := r.db.First(&user, id)

	return user, result.Error
}

func (r *UserRepository) GetUsers() ([]models.User, error) {
	var users []models.User
	result := r.db.Order("id asc").Find(&users)

	return users, result.Error
}

func (r *UserRepository) GetActiveUserByEmail(email string) (models.User, error) {
	var user models.User
	result := r.db.Where("email = ? and is_active = ?", email, true).First(&user)

	return user, result.Error
}

func (r *UserRepository) SaveUser(user models.User, userErrors *responses.UserErrors) models.User {
	if user.ID > 0 {
		var oldUser models.User

		result := r.db.First(&oldUser, user.ID)
		if result.Error != nil {
			userErrors.AddError("", "Saving user failed. Please try again later.", http.StatusInternalServerError)
			return user
		}

		if len(user.Password) == 0 {
			user.Password = oldUser.Password
		}
	}

	if user.IsActive && len(user.Password) == 0 {
		userErrors.AddError("password", "You must set password for active user.", http.StatusBadRequest)
		return user
	}

	if !r.IsUserEmailValid(user.Email, sql.NullInt64{
		Int64: int64(user.ID),
		Valid: user.ID > 0,
	}) {
		userErrors.AddError("email", "This email is already used.", http.StatusBadRequest)
		return user
	}

	result := r.db.Save(&user)
	if result.Error != nil {
		userErrors.AddError("", "Saving user failed. Please try again later.", http.StatusInternalServerError)
	}

	return user
}

func (r *UserRepository) IsUserEmailValid(email string, id sql.NullInt64) bool {
	var userCount int64
	query := r.db.Model(&models.User{})

	if id.Valid {
		query = query.Where("email = ? and id <> ?", email, id)
	} else {
		query = query.Where("email = ?", email)
	}

	result := query.Count(&userCount)
	return result.Error == nil && userCount == 0
}

func (r *UserRepository) DeleteUser(id int, deleteError *responses.DeleteError) {
	var guestCount int64
	generalError := "Database error. Please try again later."

	user, err := r.GetUser(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			deleteError.AddError("Record not found.", http.StatusNotFound)
		} else {
			deleteError.AddError(generalError, http.StatusInternalServerError)
		}
		return
	}

	result := r.db.Model(&models.Guest{}).Where("user_id = ?", id).Count(&guestCount)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
		return
	}

	if guestCount > 0 {
		deleteError.AddError("Delete guest associated with user instead.", http.StatusBadRequest)
		return
	}

	result = r.db.Delete(&user)
	if result.Error != nil {
		deleteError.AddError(generalError, http.StatusInternalServerError)
		return
	}
}

func (r *UserRepository) GetUserGuest(id int) (models.Guest, error) {
	var guest models.Guest
	result := r.db.Where("user_id = ?", id).Find(&guest)
	return guest, result.Error
}
