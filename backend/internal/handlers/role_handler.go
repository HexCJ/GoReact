package handlers

import (
	"strconv"

	"gin-user-api/internal/services"
	"gin-user-api/internal/dto"
	"github.com/gin-gonic/gin"
)

type RoleHandler struct {
	Service *services.RoleService
}

func NewRoleHandler(service *services.RoleService) *RoleHandler {
	return &RoleHandler{Service: service}
}

func (h *RoleHandler) GetAll(c *gin.Context) {
	roles, err := h.Service.GetAll()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, roles)
}

func (h *RoleHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	role, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(404, gin.H{"error": "Role not found"})
		return
	}

	c.JSON(200, role)
}

func (h *RoleHandler) Create(c *gin.Context) {
	var req dto.CreateRoleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.Create(req); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "Role created"})
}

func (h *RoleHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var req dto.UpdateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.Update(uint(id), req); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Role updated"})
}

func (h *RoleHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	if err := h.Service.Delete(uint(id)); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Role deleted"})
}