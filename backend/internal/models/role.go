package models

import "time"

type Role struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"unique;not null"`
	Description *string    `json:"description"`

	Permissions []Permission `json:"permissions" gorm:"many2many:role_has_permissions;joinForeignKey:RoleID;joinReferences:PermissionID"`
	Users []User `json:"users" gorm:"many2many:user_roles;"`

	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}