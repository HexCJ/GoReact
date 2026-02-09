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

type ProfileHandler struct {
	Service services.ProfileService
}

func NewProfileHandler(db *gorm.DB) ProfileHandler {
	repo := repositories.ProfileRepository{DB: db}
	service := services.ProfileService{Repo: repo}
	return ProfileHandler{Service: service}
}

func (h *ProfileHandler) CreateProfile(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("id"))

	var profile models.Profile
	c.ShouldBindJSON(&profile)
	profile.UserID = uint(userID)

	h.Service.Create(&profile)

	c.JSON(http.StatusCreated, profile)
}

func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	var profile models.Profile
	if err := h.Service.GetByUserID(&profile, uint(userID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
		return
	}
	var input struct {
		Phone   string `json:"phone"`
		Address string `json:"address"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	profile.Phone = input.Phone
	profile.Address = input.Address

	if err := h.Service.Update(&profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

