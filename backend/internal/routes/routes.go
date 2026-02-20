package routes

import (
	"gin-user-api/internal/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	userHandler handlers.UserHandler,
	profileHandler handlers.ProfileHandler,
	postHandler handlers.PostHandler,
	authHandler handlers.AuthHandler,
	menuHandler handlers.MenuHandler,
	roleHandler handlers.RoleHandler,
) {
	api := r.Group("/api")
	{
		// Route publik untuk login
		api.POST("/login", authHandler.Login)

		// Grup untuk user yang terotentikasi
		users := api.Group("/users")
		{
			users.GET("", userHandler.GetUsers)
			users.POST("", userHandler.CreateUser)
			users.GET("/:id", userHandler.GetUser)
			users.PUT("/:id", userHandler.UpdateUser)
			users.DELETE("/:id", userHandler.DeleteUser)

			users.POST("/:id/profile", profileHandler.CreateProfile)
			users.PUT("/:id/profile", profileHandler.UpdateProfile)

			users.GET("/:id/posts", postHandler.GetPosts)
			users.GET("/:id/posts/:post_id", postHandler.GetPost)
			users.POST("/:id/posts", postHandler.CreatePost)
			users.PUT("/:id/posts/:post_id", postHandler.UpdatePost)
			users.DELETE("/:id/posts/:post_id", postHandler.DeletePost)
		}

		// Route untuk manajemen RBAC
		roles := api.Group("/roles")
		{
			roles.GET("", roleHandler.GetAll)
			roles.POST("", roleHandler.Create)
			roles.GET("/:id", roleHandler.GetByID)
			roles.PUT("/:id", roleHandler.Update)
			roles.DELETE("/:id", roleHandler.Delete)
		}

		menus := api.Group("/menus")
		{
			menus.GET("", menuHandler.GetAll)
			menus.POST("", menuHandler.Create)
			menus.GET("/:id", menuHandler.GetByID)
			menus.PUT("/:id", menuHandler.Update)
			menus.DELETE("/:id", menuHandler.Delete)
		}

	}
}

