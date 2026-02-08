package controllers

import (
	"net/http"
	"strconv"

	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func CreateItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	if !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
		return
	}
	var item models.Item
	if err := c.BindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate item name
	if item.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item name is required"})
		return
	}
	if len(item.Name) > 100 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item name must be less than 100 characters"})
		return
	}

	// Validate price
	if item.Price < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
		return
	}

	if err := config.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func ListItems(c *gin.Context) {
	var items []models.Item
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func GetItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item
	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func UpdateItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	if !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
		return
	}
	id := c.Param("id")

	var item models.Item
	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Bind updated data
	var updateData models.Item
	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate name if provided
	if updateData.Name != "" {
		if len(updateData.Name) > 100 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Item name must be less than 100 characters"})
			return
		}
		item.Name = updateData.Name
	}

	// Validate price if provided
	if updateData.Price != 0 {
		if updateData.Price < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
			return
		}
		item.Price = updateData.Price
	}

	if err := config.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func DeleteItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	if !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
		return
	}
	id := c.Param("id")

	// Parse id to uint
	parsedID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	if err := config.DB.Delete(&models.Item{}, parsedID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}
