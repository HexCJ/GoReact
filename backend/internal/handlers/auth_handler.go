package handlers

import (
	"net/http"
	"time"
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"os"
)

type AuthHandler struct {
	UserRepository *repositories.UserRepository
	JWTSecret      string
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  interface{} `json:"user"`
}

func NewAuthHandler(userRepo *repositories.UserRepository) *AuthHandler {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "default_secret_key"
	}
	return &AuthHandler{
		UserRepository: userRepo,
		JWTSecret:      secret,
	}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cari user berdasarkan email atau username
	var user models.User
	result := h.UserRepository.DB.Where("email = ?", req.Username).First(&user)
	if result.Error != nil {
		// Jika tidak ditemukan berdasarkan email, coba cari berdasarkan nama
		result = h.UserRepository.DB.Where("name = ?", req.Username).First(&user)
		if result.Error != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
	}

	// Verifikasi password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Buat JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"name":    user.Name,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // Token berlaku 72 jam
	})

	tokenString, err := token.SignedString([]byte(h.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create token"})
		return
	}

	// Kirim response
	response := LoginResponse{
		Token: tokenString,
		User: gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	}

	c.JSON(http.StatusOK, response)
}

func (h *AuthHandler) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(h.JWTSecret), nil
	})
}