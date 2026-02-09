package handlers

import (
	"net/http"
	"strconv"

	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"gin-user-api/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RBACController struct {
	RoleService       services.RoleService
	PermissionService services.PermissionService
	UserRBACService   services.UserRBACService
}

func NewRBACController(db *gorm.DB) *RBACController {
	repo := repositories.NewRBACRepository(db)
	roleService := services.NewRoleService(repo)
	permissionService := services.NewPermissionService(repo)
	userRBACService := services.NewUserRBACService(repo)
	
	return &RBACController{
		RoleService:       roleService,
		PermissionService: permissionService,
		UserRBACService:   userRBACService,
	}
}

// Role Handlers
func (ctrl *RBACController) GetRoles(c *gin.Context) {
	var roles []models.Role
	if err := ctrl.RoleService.GetAll(&roles); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, roles)
}

func (ctrl *RBACController) GetRole(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var role models.Role

	if err := ctrl.RoleService.GetByID(&role, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Role not found"})
		return
	}

	c.JSON(http.StatusOK, role)
}

func (ctrl *RBACController) CreateRole(c *gin.Context) {
	var role models.Role

	if err := c.ShouldBindJSON(&role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if err := ctrl.RoleService.Create(&role); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, role)
}

func (ctrl *RBACController) UpdateRole(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var role models.Role

	if err := ctrl.RoleService.GetByID(&role, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Role not found"})
		return
	}

	c.ShouldBindJSON(&role)
	ctrl.RoleService.Update(&role)
	c.JSON(http.StatusOK, role)
}

func (ctrl *RBACController) DeleteRole(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var role models.Role

	if err := ctrl.RoleService.GetByID(&role, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Role not found"})
		return
	}

	ctrl.RoleService.Delete(&role)
	c.JSON(http.StatusOK, gin.H{"message": "Role deleted"})
}

// Permission Handlers
func (ctrl *RBACController) GetPermissions(c *gin.Context) {
	var permissions []models.Permission
	if err := ctrl.PermissionService.GetAll(&permissions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, permissions)
}

func (ctrl *RBACController) GetPermission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission

	if err := ctrl.PermissionService.GetByID(&permission, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Permission not found"})
		return
	}

	c.JSON(http.StatusOK, permission)
}

func (ctrl *RBACController) CreatePermission(c *gin.Context) {
	var permission models.Permission

	if err := c.ShouldBindJSON(&permission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if err := ctrl.PermissionService.Create(&permission); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, permission)
}

func (ctrl *RBACController) UpdatePermission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission

	if err := ctrl.PermissionService.GetByID(&permission, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Permission not found"})
		return
	}

	c.ShouldBindJSON(&permission)
	ctrl.PermissionService.Update(&permission)
	c.JSON(http.StatusOK, permission)
}

func (ctrl *RBACController) DeletePermission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission

	if err := ctrl.PermissionService.GetByID(&permission, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Permission not found"})
		return
	}

	ctrl.PermissionService.Delete(&permission)
	c.JSON(http.StatusOK, gin.H{"message": "Permission deleted"})
}

// Assign Permission to Role
func (ctrl *RBACController) AssignPermissionToRole(c *gin.Context) {
	roleID, _ := strconv.Atoi(c.Param("role_id"))
	permissionID, _ := strconv.Atoi(c.Param("permission_id"))

	if err := ctrl.RoleService.AssignPermission(uint(roleID), uint(permissionID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Permission assigned to role"})
}

// Remove Permission from Role
func (ctrl *RBACController) RemovePermissionFromRole(c *gin.Context) {
	roleID, _ := strconv.Atoi(c.Param("role_id"))
	permissionID, _ := strconv.Atoi(c.Param("permission_id"))

	if err := ctrl.RoleService.RemovePermission(uint(roleID), uint(permissionID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Permission removed from role"})
}

// Assign Role to User
func (ctrl *RBACController) AssignRoleToUser(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("user_id"))
	roleID, _ := strconv.Atoi(c.Param("role_id"))

	if err := ctrl.UserRBACService.AssignRole(uint(userID), uint(roleID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role assigned to user"})
}

// Remove Role from User
func (ctrl *RBACController) RemoveRoleFromUser(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("user_id"))
	roleID, _ := strconv.Atoi(c.Param("role_id"))

	if err := ctrl.UserRBACService.RemoveRole(uint(userID), uint(roleID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role removed from user"})
}

// Get User Roles
func (ctrl *RBACController) GetUserRoles(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("user_id"))
	
	roles, err := ctrl.UserRBACService.GetRolesForUser(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, roles)
}

// Get Role Permissions
func (ctrl *RBACController) GetRolePermissions(c *gin.Context) {
	roleID, _ := strconv.Atoi(c.Param("role_id"))
	
	permissions, err := ctrl.RoleService.GetPermissionsForRole(uint(roleID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, permissions)
}