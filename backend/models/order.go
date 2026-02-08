package models

import "time"

type Order struct {
	ID        uint `gorm:"primaryKey"`
	CartID    uint
	UserID    uint
	Total     float64
	Status    string `gorm:"default:"pending""`
	CreatedAt time.Time
	
	// Relationships
	Cart *Cart `gorm:"foreignKey:CartID"`
	User *User `gorm:"foreignKey:UserID"`
}
