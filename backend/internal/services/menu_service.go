package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"gin-user-api/internal/dto"
	"gorm.io/gorm"
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

func (s *MenuService) Create(req dto.CreateMenuRequest) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		menu := models.Menu{
			NamaMenu: req.NamaMenu,
			LevelMenu: req.LevelMenu,
			ApiMenu: req.ApiMenu,
			UrlMenu:  req.UrlMenu,
			Icon: req.Icon,
			NoUrut: req.NoUrut,
			StatusMenu: req.StatusMenu,
			MasterMenu: req.MasterMenu,
		}

		if err := tx.Create(&menu).Error; err != nil {
			return err
		}


		for _, p := range req.Permissions {

			permission := models.Permission{
				Nama:   	p.Nama,
				MenuID: menu.ID,
			}

			if err := tx.Create(&permission).Error; err != nil {
				return err
			}
		}

		return nil
	})
}


func (s *MenuService) Update(id uint, req dto.UpdateMenuRequest) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		var existing models.Menu
		if err := tx.First(&existing, id).Error; err != nil {
			return err
		}

		if err := tx.Model(&existing).Updates(models.Menu{
			NamaMenu: req.NamaMenu,
			LevelMenu: req.LevelMenu,
			ApiMenu: req.ApiMenu,
			UrlMenu:  req.UrlMenu,
			Icon: req.Icon,
			NoUrut: req.NoUrut,
			StatusMenu: req.StatusMenu,
			MasterMenu: req.MasterMenu,
		}).Error; err != nil {
			return err
		}

		if err := tx.Where("menu_id = ?", id).
			Delete(&models.Permission{}).Error; err != nil {
			return err
		}

		for _, p := range req.Permissions {

			permission := models.Permission{
				Nama:   p.Nama,
				MenuID: id,
			}

			if err := tx.Create(&permission).Error; err != nil {
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
