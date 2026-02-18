package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
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

func (s *MenuService) Create(menu *models.Menu) error {
	return s.Repo.Create(menu)
}

func (s *MenuService) Update(id uint, menu *models.Menu) error {
	var existing models.Menu
	if err := s.Repo.FindByID(&existing, id); err != nil {
		return err
	}

	menu.ID = existing.ID
	return s.Repo.Update(menu)
}

func (s *MenuService) Delete(id uint) error {
	var menu models.Menu
	if err := s.Repo.FindByID(&menu, id); err != nil {
		return err
	}
	return s.Repo.Delete(&menu)
}
