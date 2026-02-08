package main

import (
	"shopping-cart/config"
	"shopping-cart/models"
	"shopping-cart/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func main() {

	config.Connect()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
	)

	r := gin.Default()

	// ✅ ADD THIS BLOCK
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	 // Seed sample data
	 seedData()
	 routes.RegisterRoutes(r)
	 r.Run(":8080")
	}

	func seedData() {
	 // Check if already seeded
	 var count int64
	 config.DB.Model(&models.User{}).Count(&count)
	 if count > 0 {
	  return
	 }

	 // Hash passwords
	 adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	 userPassword, _ := bcrypt.GenerateFromPassword([]byte("user123"), bcrypt.DefaultCost)

	 // Create admin and regular user
	 admin := models.User{Username: "admin", Password: string(adminPassword), Admin: true}
	 user := models.User{Username: "user", Password: string(userPassword), Admin: false}
	 config.DB.Create(&admin)
	 config.DB.Create(&user)

	 // Create items
	 item1 := models.Item{Name: "Laptop", Price: 999.99}
	 item2 := models.Item{Name: "Phone", Price: 499.99}
	 item3 := models.Item{Name: "Headphones", Price: 199.99}
	 item4 := models.Item{Name: "Smartwatch", Price: 299.99}
	 item5 := models.Item{Name: "Tablet", Price: 399.99}
	 item6 := models.Item{Name: "Camera", Price: 599.99}
	 item7 := models.Item{Name: "Speaker", Price: 149.99}
	 item8 := models.Item{Name: "Monitor", Price: 249.99}
	 config.DB.Create(&item1)
	 config.DB.Create(&item2)
	 config.DB.Create(&item3)
	 config.DB.Create(&item4)
	 config.DB.Create(&item5)
	 config.DB.Create(&item6)
	 config.DB.Create(&item7)
	 config.DB.Create(&item8)

	 // Create cart for user and add items
	 cart := models.Cart{UserID: user.ID}
	 config.DB.Create(&cart)
	 cartItem1 := models.CartItem{CartID: cart.ID, ItemID: item1.ID, Price: item1.Price, Quantity: 1}
	 cartItem2 := models.CartItem{CartID: cart.ID, ItemID: item2.ID, Price: item2.Price, Quantity: 2}
	 config.DB.Create(&cartItem1)
	 config.DB.Create(&cartItem2)

	 // Create order for user
	 order := models.Order{CartID: cart.ID, UserID: user.ID, Total: 1998.97, Status: "completed"}
	 config.DB.Create(&order)
	}
