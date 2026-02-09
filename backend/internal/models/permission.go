package models

import "time"

type Permission struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"unique;not null"`
	Description string    `json:"description"`
	Action      string    `json:"action"`  // contoh: "read", "write", "delete"
	Resource    string    `json:"resource"` // contoh: "user", "post", "profile"
	
	Roles []Role `json:"roles" gorm:"many2many:role_permissions;"`
	
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}