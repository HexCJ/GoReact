	package models

	import "time"

	type User struct {
		ID        uint      `json:"id" gorm:"primaryKey"`
		Name      string    `json:"name"`
		Email     string    `json:"email" gorm:"unique"`
		Password  string    `json:"password,omitempty" gorm:"column:password"`

		Profile Profile 	`json:"profile" gorm:"foreignKey:UserID;references:ID"`
		Posts   []Post  	`json:"posts" gorm:"foreignKey:UserID"`
		Roles   []Role      `json:"roles" gorm:"many2many:user_roles;"`

		CreatedAt time.Time `json:"created_at"`
		UpdatedAt time.Time `json:"updated_at"`
	}
