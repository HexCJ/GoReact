package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"strings"
	"gorm.io/gorm"
	"errors"
)

type MenuService struct {
	Repo *repositories.MenuRepository
}

func NewMenuService(repo *repositories.MenuRepository) *MenuService {
	return &MenuService{Repo: repo}
}

func (s *MenuService) GetAll() ([]models.Menu, error) {
	var menus []models.Menu
	err := s.Repo.FindAll(&menus)
	return menus, err
}

func (s *MenuService) GetByID(id uint) (models.Menu, error) {
	var menu models.Menu
	err := s.Repo.FindByID(&menu, id)
	return menu, err
}

func formatMenuName(name string) string {
	name = strings.ToLower(name)
	name = strings.ReplaceAll(name, " ", "_")
	return name
}


func (s *MenuService) Create(menu *models.Menu) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		permissions := menu.Permissions
		menu.Permissions = nil 

		if err := tx.Create(menu).Error; err != nil {
			return err
		}

		if menu.NamaMenu == nil {
			return errors.New("nama_menu is required")
		}

		prefix := formatMenuName(*menu.NamaMenu)


		for i := range permissions {

			permissions[i].ID = 0
			permissions[i].MenuID = menu.ID

			if !strings.HasPrefix(permissions[i].Nama, prefix+"-") {
				permissions[i].Nama = prefix + "-" + permissions[i].Nama
			}

			if err := tx.Create(&permissions[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *MenuService) Update(id uint, menu *models.Menu) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		var existing models.Menu
		if err := tx.First(&existing, id).Error; err != nil {
			return err
		}

		if err := tx.Model(&existing).Updates(models.Menu{
			NamaMenu: menu.NamaMenu,
			UrlMenu:  menu.UrlMenu,
		}).Error; err != nil {
			return err
		}

		if err := tx.Where("menu_id = ?", id).
			Delete(&models.Permission{}).Error; err != nil {
			return err
		}

		if menu.NamaMenu == nil {
			return errors.New("nama_menu is required")
		}

		prefix := formatMenuName(*menu.NamaMenu)


		for i := range menu.Permissions {

			menu.Permissions[i].ID = 0
			menu.Permissions[i].MenuID = id

			if !strings.HasPrefix(menu.Permissions[i].Nama, prefix+"-") {
				menu.Permissions[i].Nama = prefix + "-" + menu.Permissions[i].Nama
			}

			if err := tx.Create(&menu.Permissions[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})
}




func (s *MenuService) Delete(id uint) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		if err := tx.Where("menu_id = ?", id).
			Delete(&models.Permission{}).Error; err != nil {
			return err
		}

		if err := tx.Delete(&models.Menu{}, id).Error; err != nil {
			return err
		}

		return nil
	})
}
