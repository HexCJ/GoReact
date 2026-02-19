package dto

type PermissionInput struct {
	Nama string `json:"nama" binding:"required"`
}

type CreateMenuRequest struct {
	NamaMenu   string            `json:"nama_menu" binding:"required"`
	LevelMenu   *int         `json:"level_menu"`
	UrlMenu    string            `json:"url_menu" binding:"required"`
	ApiMenu    string            `json:"api_menu" binding:"required"`
	Icon    *string            `json:"icon"`
	NoUrut      *int         `json:"no_urut"`
	StatusMenu  *int         `json:"status_menu"`
	MasterMenu  *int         `json:"master_menu"`
	Permissions []PermissionInput `json:"permissions"`
}

type UpdateMenuRequest struct {
	NamaMenu   string            `json:"nama_menu" binding:"required"`
	LevelMenu   *int         `json:"level_menu"`
	UrlMenu    string            `json:"url_menu" binding:"required"`
	ApiMenu    string            `json:"api_menu" binding:"required"`
	Icon    *string            `json:"icon"`
	NoUrut      *int         `json:"no_urut"`
	StatusMenu  *int         `json:"status_menu"`
	MasterMenu  *int         `json:"master_menu"`
	Permissions []PermissionInput `json:"permissions"`
}
