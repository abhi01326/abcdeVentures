package config

import (
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	db, err := gorm.Open(sqlite.Open("shop.db"), &gorm.Config{})
	if err != nil {
		panic(err)   // <-- temporarily show real error
	}
	DB = db
}
