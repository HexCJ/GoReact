package repositories

import (
	"gin-user-api/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) FindAll(users *[]models.User) error {
	return r.DB.Preload("Profile").Preload("Posts").Find(users).Error
}

func (r *UserRepository) FindByID(user *models.User, id uint) error {
	return r.DB.First(user, id).Error
}

func (r *UserRepository) Create(user *models.User) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) Update(user *models.User) error {
	return r.DB.Save(user).Error
}

func (r *UserRepository) Delete(user *models.User) error {
	return r.DB.Delete(user).Error
}
