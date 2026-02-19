package models

import "time"

type Menu struct {
	ID          uint         `gorm:"primaryKey;column:id"`
	NamaMenu    string       `gorm:"column:nama_menu;size:100;not null"`
	LevelMenu   *int         `gorm:"column:level_menu"`
	UrlMenu     string       `gorm:"column:url_menu;size:255;not null"`
	ApiMenu     string       `gorm:"column:api_menu;size:255;not null"`
	Icon        *string      `gorm:"column:icon;size:100"`
	Permissions []Permission `gorm:"foreignKey:MenuID"`
	NoUrut      *int         `gorm:"column:no_urut"`
	StatusMenu  *int         `gorm:"column:status_menu"`
	MasterMenu  *int         `gorm:"column:master_menu"`
	CreatedAt   time.Time    `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt   time.Time    `gorm:"column:updated_at;autoUpdateTime"`
}

func (Menu) TableName() string {
	return "menu"
}
