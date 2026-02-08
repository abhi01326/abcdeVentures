package controllers

import (
	"net/http"
	"strconv"

	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var body struct {
		ItemID   uint
		Quantity int
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate quantity
	if body.Quantity <= 0 {
		body.Quantity = 1
	}
	if body.Quantity > 100 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity cannot exceed 100"})
		return
	}

	// Get or create cart for user
	var cart models.Cart
	if err := config.DB.Where("user_id=?", user.ID).FirstOrCreate(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get cart"})
		return
	}

	// Check if item exists
	var item models.Item
	if err := config.DB.First(&item, body.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Check if item already in cart
	var cartItem models.CartItem
	if err := config.DB.Where("cart_id=? AND item_id=?", cart.ID, body.ItemID).First(&cartItem).Error; err == nil {
		// Item already in cart, update quantity
		cartItem.Quantity += body.Quantity
		// Cap quantity at 100
		if cartItem.Quantity > 100 {
			cartItem.Quantity = 100
		}
	} else {
		// Add new item to cart with price
		cartItem = models.CartItem{
			CartID:   cart.ID,
			ItemID:   body.ItemID,
			Price:    item.Price,
			Quantity: body.Quantity,
		}
	}

	if err := config.DB.Save(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to cart"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Added to cart", "cart_item": cartItem})
}

func UpdateCartItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var body struct {
		Quantity int
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate quantity
	if body.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity must be at least 1"})
		return
	}
	if body.Quantity > 100 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity cannot exceed 100"})
		return
	}

	cartItemID := c.Param("id")
	parsedID, err := strconv.ParseUint(cartItemID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item ID"})
		return
	}

	var cartItem models.CartItem
	if err := config.DB.First(&cartItem, parsedID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	var cart models.Cart
	if err := config.DB.First(&cart, cartItem.CartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cart.UserID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	cartItem.Quantity = body.Quantity
	if err := config.DB.Save(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}

	// Reload with item details
	config.DB.Preload("Item").First(&cartItem, cartItem.ID)
	c.JSON(http.StatusOK, cartItem)
}

func RemoveCartItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	cartItemID := c.Param("id")
	parsedID, err := strconv.ParseUint(cartItemID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item ID"})
		return
	}

	var cartItem models.CartItem
	if err := config.DB.First(&cartItem, parsedID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	var cart models.Cart
	if err := config.DB.First(&cart, cartItem.CartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cart.UserID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	if err := config.DB.Delete(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove cart item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart item removed"})
}

func ListCarts(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var cart models.Cart
	if err := config.DB.Where("user_id=?", user.ID).First(&cart).Error; err != nil {
		// Create cart if doesn't exist
		cart = models.Cart{UserID: user.ID}
		if err := config.DB.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}
	}

	// Get cart items with item details included
	var cartItems []models.CartItem
	config.DB.Preload("Item").Where("cart_id=?", cart.ID).Find(&cartItems)

	// Calculate total
	var total float64
	for _, item := range cartItems {
		total += item.Price * float64(item.Quantity)
	}

	c.JSON(http.StatusOK, gin.H{
		"cart_id": cart.ID,
		"items":   cartItems,
		"total":   total,
	})
}
