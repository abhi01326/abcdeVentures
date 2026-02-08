package models

type Cart struct {
	ID     uint `gorm:"primaryKey"`
	UserID uint

	// Relationships
	User      *User      `gorm:"foreignKey:UserID"`
	CartItems []CartItem `gorm:"foreignKey:CartID"`
}
