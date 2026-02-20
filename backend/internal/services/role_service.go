package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"gin-user-api/internal/dto"
	"gorm.io/gorm"
)

type RoleService struct {
	Repo *repositories.RoleRepository
}

func NewRoleService(repo *repositories.RoleRepository) *RoleService {
	return &RoleService{Repo: repo}
}

func (s *RoleService) GetAll() ([]models.Role, error) {
	var roles []models.Role
	err := s.Repo.FindAll(&roles)
	return roles, err
}

func (s *RoleService) GetByID(id uint) (models.Role, error) {
	var role models.Role
	err := s.Repo.FindByID(&role, id)
	return role, err
}

func (s *RoleService) Create(req dto.CreateRoleRequest) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		role := models.Role{
			Name:        req.Name,
			Description: req.Description,
		}

		if err := tx.Create(&role).Error; err != nil {
			return err
		}

		if len(req.Permissions) > 0 {
			var permissions []models.Permission
			if err := tx.Where("id IN ?", req.Permissions).
				Find(&permissions).Error; err != nil {
				return err
			}

			if err := tx.Model(&role).
				Association("Permissions").
				Replace(&permissions); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *RoleService) Update(id uint, req dto.UpdateRoleRequest) error {
	return s.Repo.DB.Transaction(func(tx *gorm.DB) error {

		var role models.Role
		if err := tx.First(&role, id).Error; err != nil {
			return err
		}

		role.Name = req.Name
		role.Description = req.Description

		if err := tx.Save(&role).Error; err != nil {
			return err
		}

		var permissions []models.Permission
		if len(req.Permissions) > 0 {
			if err := tx.Where("id IN ?", req.Permissions).
				Find(&permissions).Error; err != nil {
				return err
			}
		}

		return tx.Model(&role).
			Association("Permissions").
			Replace(&permissions)
	})
}

func (s *RoleService) Delete(id uint) error {
	return s.Repo.Delete(id)
}