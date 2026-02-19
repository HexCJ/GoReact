package models

import "time"

type Menu struct {
	ID         uint       `json:"id" gorm:"primaryKey;column:id"`
	NamaMenu   *string    `json:"nama_menu" gorm:"column:nama_menu;size:100"`
	LevelMenu  *int       `json:"level_menu" gorm:"column:level_menu"`
	UrlMenu    string     `json:"url_menu" gorm:"column:url_menu;size:255;not null"`
	Icon       *string    `json:"icon" gorm:"column:icon;size:100"`
	Permissions []Permission `json:"permissions" gorm:"foreignKey:MenuID"`
	NoUrut     *int       `json:"no_urut" gorm:"column:no_urut"`
	StatusMenu *int       `json:"status_menu" gorm:"column:status_menu"`
	MasterMenu *int       `json:"master_menu" gorm:"column:master_menu"`
	CreatedAt  time.Time  `json:"created_at" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt  time.Time  `json:"updated_at" gorm:"column:updated_at;autoUpdateTime"`
}

func (Menu) TableName() string {
	return "menu"
}
