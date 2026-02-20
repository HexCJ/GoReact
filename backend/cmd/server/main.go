package main

import (
	"log"

	"gin-user-api/config"
	"gin-user-api/internal/handlers"
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"gin-user-api/internal/routes"
	"gin-user-api/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	db := config.ConnectDB()

	db.AutoMigrate(
		&models.User{},
		&models.Profile{},
		&models.Post{},
		&models.Role{},
		&models.Permission{},
		&models.UserRole{},
		&models.RolePermission{},
		&models.Menu{},
	    &models.RoleHasPermission{},
	)

	userHandler := handlers.NewUserHandler(db)
	profileHandler := handlers.NewProfileHandler(db)
	postHandler := handlers.NewPostHandler(db)
	authHandler := handlers.NewAuthHandler(repositories.NewUserRepository(db))
	roleRepo := repositories.NewRoleRepository(db)
	roleService := services.NewRoleService(roleRepo)
	roleHandler := handlers.NewRoleHandler(roleService)
	menuRepo := repositories.NewMenuRepository(db)
	menuService := services.NewMenuService(menuRepo)
	menuHandler := handlers.NewMenuHandler(menuService)


	r := gin.Default()

	// Konfigurasi CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"} // Izinkan frontend Vite
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.AllowCredentials = true

	r.Use(cors.New(config))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	
	routes.RegisterRoutes(
		r,
		userHandler,
		profileHandler,
		postHandler,
		*authHandler,
		*menuHandler,   // ✅ benar
		*roleHandler,
	)

	log.Println("Server running at :8081")
	r.Run(":8081")
}
