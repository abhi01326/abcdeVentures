package controllers

import (
	"net/http"
	"regexp"
	"strings"

	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// validatePassword checks if password meets security requirements
func validatePassword(password string) string {
	if len(password) < 6 {
		return "Password must be at least 6 characters"
	}
	if len(password) > 50 {
		return "Password must be less than 50 characters"
	}
	return ""
}

// validateUsername checks if username is valid
func validateUsername(username string) string {
	if len(username) < 3 {
		return "Username must be at least 3 characters"
	}
	if len(username) > 30 {
		return "Username must be less than 30 characters"
	}
	// Allow only alphanumeric characters and underscores
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_]+$`, username)
	if !matched {
		return "Username can only contain letters, numbers, and underscores"
	}
	return ""
}

func Register(c *gin.Context) {
	var user models.User
	c.BindJSON(&user)

	// Trim whitespace
	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.TrimSpace(user.Password)

	// Validate input
	if user.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}
	if user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	// Validate username format
	if errMsg := validateUsername(user.Username); errMsg != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": errMsg})
		return
	}

	// Validate password strength
	if errMsg := validatePassword(user.Password); errMsg != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": errMsg})
		return
	}

	// Check if username already exists
	var existingUser models.User
	if err := config.DB.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}
	user.Password = string(hashedPassword)

	// Create user
	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Don't return password in response
	user.Password = ""
	c.JSON(http.StatusCreated, user)
}

func Login(c *gin.Context) {
	var body models.User
	c.BindJSON(&body)

	// Trim whitespace
	body.Username = strings.TrimSpace(body.Username)
	body.Password = strings.TrimSpace(body.Password)

	// Find user
	var user models.User
	if err := config.DB.Where("username = ?", body.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Generate token
	token := uuid.NewString()
	user.Token = token
	config.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"token": token, "user_id": user.ID, "username": user.Username, "admin": user.Admin})
}

func ListUsers(c *gin.Context) {
	// Check if admin
	user := c.MustGet("user").(models.User)
	if !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
		return
	}

	var users []models.User
	config.DB.Find(&users)

	// Don't return passwords
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, users)
}
