package dto

type CreateRoleRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description *string `json:"description"`
	PermissionIDs []uint `json:"permission_ids"`
}

type UpdateRoleRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description *string `json:"description"`
	PermissionIDs []uint `json:"permission_ids"`
}

type RoleResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description *string `json:"description"`
	Permissions []PermissionSimple `json:"permissions"`
}

type PermissionSimple struct {
	ID   uint   `json:"id"`
	Nama string `json:"nama"`
}