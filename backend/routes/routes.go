package routes

import (
	"shopping-cart/controllers"
	"shopping-cart/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	// Public routes
	r.POST("/users", controllers.Register)
	r.POST("/users/login", controllers.Login)
	r.GET("/items", controllers.ListItems)
	r.GET("/items/:id", controllers.GetItem)

	// Authenticated routes
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	auth.GET("/users", controllers.ListUsers)

	// Item management (admin only)
	auth.POST("/items", controllers.CreateItem)
	auth.PUT("/items/:id", controllers.UpdateItem)
	auth.DELETE("/items/:id", controllers.DeleteItem)

	// Cart management
	auth.POST("/carts", controllers.AddToCart)
	auth.PUT("/carts/:id", controllers.UpdateCartItem)
	auth.DELETE("/carts/:id", controllers.RemoveCartItem)
	auth.GET("/carts", controllers.ListCarts)

	// Order management
	auth.POST("/orders", controllers.CreateOrder)
	auth.GET("/orders/user", controllers.UserOrders)
	auth.GET("/orders/admin", controllers.AdminOrders)
	auth.PUT("/orders/:id", controllers.UpdateOrderStatus)
}
