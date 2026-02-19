package repositories

import (
	"gin-user-api/internal/models"
	"gorm.io/gorm"
)

type MenuRepository struct {
	DB *gorm.DB
}

func NewMenuRepository(db *gorm.DB) *MenuRepository {
	return &MenuRepository{DB: db}
}

func (r *MenuRepository) FindAll(menus *[]models.Menu) error {
	return r.DB.Preload("Permissions").Find(menus).Error
}

func (r *MenuRepository) FindByID(menu *models.Menu, id uint) error {
	return r.DB.Preload("Permissions").First(menu, id).Error
}

func (r *MenuRepository) Create(menu *models.Menu) error {
	return r.DB.Create(menu).Error
}

func (r *MenuRepository) Update(menu *models.Menu) error {
	return r.DB.Save(menu).Error
}

func (r *MenuRepository) Delete(menu *models.Menu) error {
	return r.DB.Delete(menu).Error
}
