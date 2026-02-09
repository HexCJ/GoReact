package repositories

import (
	"gin-user-api/internal/models"
	"gorm.io/gorm"
)

type RBACRepository struct {
	DB *gorm.DB
}

func NewRBACRepository(db *gorm.DB) *RBACRepository {
	return &RBACRepository{DB: db}
}

// Role Repository Methods
func (r *RBACRepository) FindAllRoles(roles *[]models.Role) error {
	return r.DB.Preload("Permissions").Preload("Users").Find(roles).Error
}

func (r *RBACRepository) FindRoleByID(role *models.Role, id uint) error {
	return r.DB.Preload("Permissions").Preload("Users").First(role, id).Error
}

func (r *RBACRepository) CreateRole(role *models.Role) error {
	return r.DB.Create(role).Error
}

func (r *RBACRepository) UpdateRole(role *models.Role) error {
	return r.DB.Save(role).Error
}

func (r *RBACRepository) DeleteRole(role *models.Role) error {
	return r.DB.Delete(role).Error
}

// Permission Repository Methods
func (r *RBACRepository) FindAllPermissions(permissions *[]models.Permission) error {
	return r.DB.Preload("Roles").Find(permissions).Error
}

func (r *RBACRepository) FindPermissionByID(permission *models.Permission, id uint) error {
	return r.DB.Preload("Roles").First(permission, id).Error
}

func (r *RBACRepository) CreatePermission(permission *models.Permission) error {
	return r.DB.Create(permission).Error
}

func (r *RBACRepository) UpdatePermission(permission *models.Permission) error {
	return r.DB.Save(permission).Error
}

func (r *RBACRepository) DeletePermission(permission *models.Permission) error {
	return r.DB.Delete(permission).Error
}

// UserRole Repository Methods
func (r *RBACRepository) AssignRoleToUser(userID, roleID uint) error {
	user := models.User{ID: userID}
	role := models.Role{ID: roleID}
	return r.DB.Model(&user).Association("Roles").Append(&role)
}

func (r *RBACRepository) RemoveRoleFromUser(userID, roleID uint) error {
	user := models.User{ID: userID}
	role := models.Role{ID: roleID}
	return r.DB.Model(&user).Association("Roles").Delete(&role)
}

func (r *RBACRepository) GetUserRoles(userID uint) ([]models.Role, error) {
	var user models.User
	err := r.DB.Preload("Roles").First(&user, userID).Error
	if err != nil {
		return nil, err
	}
	return user.Roles, nil
}

// RolePermission Repository Methods
func (r *RBACRepository) AssignPermissionToRole(roleID, permissionID uint) error {
	role := models.Role{ID: roleID}
	permission := models.Permission{ID: permissionID}
	return r.DB.Model(&role).Association("Permissions").Append(&permission)
}

func (r *RBACRepository) RemovePermissionFromRole(roleID, permissionID uint) error {
	role := models.Role{ID: roleID}
	permission := models.Permission{ID: permissionID}
	return r.DB.Model(&role).Association("Permissions").Delete(&permission)
}

func (r *RBACRepository) GetRolePermissions(roleID uint) ([]models.Permission, error) {
	var role models.Role
	err := r.DB.Preload("Permissions").First(&role, roleID).Error
	if err != nil {
		return nil, err
	}
	return role.Permissions, nil
}