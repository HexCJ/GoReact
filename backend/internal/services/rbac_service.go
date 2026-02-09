package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
)

type RoleService struct {
	Repo *repositories.RBACRepository
}

func NewRoleService(repo *repositories.RBACRepository) RoleService {
	return RoleService{Repo: repo}
}

func (s *RoleService) GetAll(roles *[]models.Role) error {
	return s.Repo.FindAllRoles(roles)
}

func (s *RoleService) GetByID(role *models.Role, id uint) error {
	return s.Repo.FindRoleByID(role, id)
}

func (s *RoleService) Create(role *models.Role) error {
	return s.Repo.CreateRole(role)
}

func (s *RoleService) Update(role *models.Role) error {
	return s.Repo.UpdateRole(role)
}

func (s *RoleService) Delete(role *models.Role) error {
	return s.Repo.DeleteRole(role)
}

func (s *RoleService) AssignPermission(roleID, permissionID uint) error {
	return s.Repo.AssignPermissionToRole(roleID, permissionID)
}

func (s *RoleService) RemovePermission(roleID, permissionID uint) error {
	return s.Repo.RemovePermissionFromRole(roleID, permissionID)
}

func (s *RoleService) GetPermissionsForRole(roleID uint) ([]models.Permission, error) {
	return s.Repo.GetRolePermissions(roleID)
}

type PermissionService struct {
	Repo *repositories.RBACRepository
}

func NewPermissionService(repo *repositories.RBACRepository) PermissionService {
	return PermissionService{Repo: repo}
}

func (s *PermissionService) GetAll(permissions *[]models.Permission) error {
	return s.Repo.FindAllPermissions(permissions)
}

func (s *PermissionService) GetByID(permission *models.Permission, id uint) error {
	return s.Repo.FindPermissionByID(permission, id)
}

func (s *PermissionService) Create(permission *models.Permission) error {
	return s.Repo.CreatePermission(permission)
}

func (s *PermissionService) Update(permission *models.Permission) error {
	return s.Repo.UpdatePermission(permission)
}

func (s *PermissionService) Delete(permission *models.Permission) error {
	return s.Repo.DeletePermission(permission)
}

type UserRBACService struct {
	Repo *repositories.RBACRepository
}

func NewUserRBACService(repo *repositories.RBACRepository) UserRBACService {
	return UserRBACService{Repo: repo}
}

func (s *UserRBACService) AssignRole(userID, roleID uint) error {
	return s.Repo.AssignRoleToUser(userID, roleID)
}

func (s *UserRBACService) RemoveRole(userID, roleID uint) error {
	return s.Repo.RemoveRoleFromUser(userID, roleID)
}

func (s *UserRBACService) GetRolesForUser(userID uint) ([]models.Role, error) {
	return s.Repo.GetUserRoles(userID)
}