package dto

type PermissionResponse struct {
	ID   uint   `json:"id"`
	Nama string `json:"nama"`
}

type MenuResponse struct {
	ID          uint                 `json:"id"`
	NamaMenu    string               `json:"nama_menu"`
	LevelMenu   *int                 `json:"level_menu"`
	ApiMenu     string               `json:"api_menu"`
	UrlMenu     string               `json:"url_menu"`
	Icon        *string              `json:"icon"`
	NoUrut      *int                 `json:"no_urut"`
	StatusMenu  *int                 `json:"status_menu"`
	MasterMenu  *int                 `json:"master_menu,omitempty"`
	Permissions []PermissionResponse `json:"permissions"`
}
