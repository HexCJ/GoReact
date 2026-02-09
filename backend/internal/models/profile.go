package models

import "time"

type Profile struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	UserID uint   `json:"user_id"` 

	Phone   string `json:"phone"`
	Address string `json:"address"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
