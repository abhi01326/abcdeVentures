package models

import "gorm.io/gorm"

type CartItem struct {
	ID       uint `gorm:"primaryKey"`
	CartID   uint
	ItemID   uint
	Price    float64
	Quantity int `gorm:"default:1"`
	
	// Relationships
	Cart *Cart `gorm:"foreignKey:CartID"`
	Item *Item `gorm:"foreignKey:ItemID"`
}

// BeforeSave - hook to auto-update price from item if not set
func (ci *CartItem) BeforeSave(tx *gorm.DB) error {
	if ci.ItemID != 0 && ci.Price == 0 {
		var item Item
		if err := tx.First(&item, ci.ItemID).Error; err == nil {
			ci.Price = item.Price
		}
	}
	return nil
}
