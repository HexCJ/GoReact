package repositories

import (
	"gin-user-api/internal/models"
	"gorm.io/gorm"
)

type ProfileRepository struct {
	DB *gorm.DB
}

func (r *ProfileRepository) FindByUserID(profile *models.Profile, userID uint) error {
	return r.DB.Where("user_id = ?", userID).First(profile).Error
}

func (r *ProfileRepository) Create(profile *models.Profile) error {
	return r.DB.Create(profile).Error
}

func (r *ProfileRepository) Update(profile *models.Profile) error {
	return r.DB.Save(profile).Error
}
