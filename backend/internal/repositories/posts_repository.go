package repositories

import (
	"gin-user-api/internal/models"
	"gorm.io/gorm"
)

type PostRepository struct {
	DB *gorm.DB
}

func (r *PostRepository) FindAll(posts *[]models.Post, userID uint) error {
	return r.DB.Where("user_id = ?", userID).Find(posts).Error
}

func (r *PostRepository) FindByID(post *models.Post, id uint) error {
	return r.DB.First(post, id).Error
}

func (r *PostRepository) Create(post *models.Post) error {
	return r.DB.Create(post).Error
}

func (r *PostRepository) Update(post *models.Post) error {
	return r.DB.Save(post).Error
}

func (r *PostRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Post{}, id).Error
}
