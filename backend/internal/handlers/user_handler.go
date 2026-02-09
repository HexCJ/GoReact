package handlers

import (
	"net/http"
	"strconv"

	"gin-user-api/internal/models"
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
	var users []models.User
	if err := h.Service.GetAll(&users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var user models.User

	if err := h.Service.GetByID(&user, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "password wajib diisi"})
		return
	}

	if err := h.Service.Create(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	user.Password = "" 
	c.JSON(http.StatusCreated, user)
}


func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var user models.User

	if err := h.Service.GetByID(&user, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.ShouldBindJSON(&user)
	h.Service.Update(&user)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var user models.User

	if err := h.Service.GetByID(&user, uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	h.Service.Delete(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
