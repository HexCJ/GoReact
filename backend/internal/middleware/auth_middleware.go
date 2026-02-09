package middleware

import (
	"net/http"
	"strings"
	"gin-user-api/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(authHandler *handlers.AuthHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Ekstrak token dari header Authorization
		tokenString := ""
		if len(authHeader) >= 7 && strings.ToUpper(authHeader[0:7]) == "BEARER " {
			tokenString = authHeader[7:]
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		// Validasi token
		token, err := authHandler.ValidateToken(tokenString)
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Simpan claims ke context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("user_id", uint(claims["user_id"].(float64)))
			c.Set("user_email", claims["email"].(string))
			c.Set("user_name", claims["name"].(string))
		}

		c.Next()
	}
}