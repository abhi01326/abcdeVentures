package controllers

import (
	"net/http"
	"strconv"

	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var cart models.Cart
	if err := config.DB.Where("user_id = ?", user.ID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Get cart items to calculate total
	var cartItems []models.CartItem
	if err := config.DB.Where("cart_id = ?", cart.ID).Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get cart items"})
		return
	}

	// Check if cart is empty
	if len(cartItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot create order with empty cart"})
		return
	}

	// Calculate total
	var total float64
	for _, item := range cartItems {
		total += item.Price * float64(item.Quantity)
	}

	// Create order with total
	order := models.Order{
		CartID: cart.ID,
		UserID: user.ID,
		Total:  total,
		Status: "completed",
	}
	if err := config.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Clear cart items and delete cart
	config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{})
	config.DB.Delete(&cart)

	// Reload order with cart items
	var orderItems []models.CartItem
	config.DB.Where("cart_id = ?", order.CartID).Find(&orderItems)

	c.JSON(http.StatusCreated, gin.H{
		"order":     order,
		"items":     orderItems,
		"total":     total,
		"message":   "Order created successfully",
	})
}

func UserOrders(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var orders []models.Order
	if err := config.DB.Preload("Cart").Where("user_id=?", user.ID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func AdminOrders(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	if !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
		return
	}

	var orders []models.Order
	if err := config.DB.Preload("User").Preload("Cart").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// UpdateOrderStatus - allows admin to update order status
func UpdateOrderStatus(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	if !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
		return
	}

	orderID := c.Param("id")
	parsedID, err := strconv.ParseUint(orderID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate status
	validStatuses := map[string]bool{
		"pending":    true,
		"processing": true,
		"shipped":    true,
		"completed": true,
		"cancelled":  true,
	}
	if !validStatuses[body.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status. Valid statuses: pending, processing, shipped, completed, cancelled"})
		return
	}

	var order models.Order
	if err := config.DB.First(&order, parsedID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	order.Status = body.Status
	if err := config.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated", "order": order})
}
