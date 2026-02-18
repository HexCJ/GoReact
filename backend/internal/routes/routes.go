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
	rbacHandler handlers.RBACController,
	menuHandler handlers.MenuHandler,
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
			
			// Route untuk RBAC - assign/remove role dari user
			// Menggunakan path yang berbeda untuk menghindari konflik dengan route user
			users.POST("/:id/assign-role/:role_id", rbacHandler.AssignRoleToUser)
			users.DELETE("/:id/assign-role/:role_id", rbacHandler.RemoveRoleFromUser)
			users.GET("/:id/roles", rbacHandler.GetUserRoles)
		}

		// Route untuk manajemen RBAC
		roles := api.Group("/roles")
		{
			roles.GET("", rbacHandler.GetRoles)
			roles.POST("", rbacHandler.CreateRole)
			roles.GET("/:id", rbacHandler.GetRole)
			roles.PUT("/:id", rbacHandler.UpdateRole)
			roles.DELETE("/:id", rbacHandler.DeleteRole)
			
			// Route untuk manajemen permission di role
			roles.POST("/:id/assign-permission/:permission_id", rbacHandler.AssignPermissionToRole)
			roles.DELETE("/:id/assign-permission/:permission_id", rbacHandler.RemovePermissionFromRole)
			roles.GET("/:id/permissions", rbacHandler.GetRolePermissions)
		}

		permissions := api.Group("/permissions")
		{
			permissions.GET("", rbacHandler.GetPermissions)
			permissions.POST("", rbacHandler.CreatePermission)
			permissions.GET("/:id", rbacHandler.GetPermission)
			permissions.PUT("/:id", rbacHandler.UpdatePermission)
			permissions.DELETE("/:id", rbacHandler.DeletePermission)
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

