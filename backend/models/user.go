package models

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
	Token    string
	CartID   uint
	Admin    bool `gorm:"default:false"`
}
