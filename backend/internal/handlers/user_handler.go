package handlers

import (
	"net/http"
	"strconv"

	"gin-user-api/internal/dto"
	"gin-user-api/internal/services"
	"gin-user-api/internal/repositories" 
	"github.com/gin-gonic/gin"

	"gorm.io/gorm"
)

type UserHandler struct {
	Service services.UserService
}

func NewUserHandler(db *gorm.DB) UserHandler {
	repo := repositories.UserRepository{DB: db}
	service := services.UserService{Repo: repo}
	return UserHandler{Service: service}
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	users, err := h.Service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []dto.UserResponse

	for _, u := range users {
		resp := dto.UserResponse{
			ID:    u.ID,
			Name:  u.Name,
			Email: u.Email,
		}

		resp.Role.ID = u.Role.ID
		resp.Role.Name = u.Role.Name

		response = append(response, resp)
	}

	c.JSON(http.StatusOK, response)
}

func (h *UserHandler) GetUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	user, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	resp := dto.UserResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}

	resp.Role.ID = user.Role.ID
	resp.Role.Name = user.Role.Name

	c.JSON(http.StatusOK, resp)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req dto.CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.Create(req); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "User created"})
}


func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.Update(uint(id), req); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User updated"})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	if err := h.Service.Delete(uint(id)); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User deleted"})
}