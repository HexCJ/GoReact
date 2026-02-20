package repositories

import (
	"gin-user-api/internal/models"
	"gorm.io/gorm"
)

type RoleRepository struct {
	DB *gorm.DB
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{DB: db}
}

func (r *RoleRepository) FindAll(roles *[]models.Role) error {
	return r.DB.Preload("Permissions").Find(roles).Error
}

func (r *RoleRepository) FindByID(role *models.Role, id uint) error {
	return r.DB.Preload("Permissions").First(role, id).Error
}

func (r *RoleRepository) Create(role *models.Role) error {
	return r.DB.Create(role).Error
}

func (r *RoleRepository) Update(role *models.Role) error {
	return r.DB.Save(role).Error
}

func (r *RoleRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Role{}, id).Error
}