package middleware

import (
	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
 return func(c *gin.Context) {
  token := c.GetHeader("Authorization")
  var user models.User
  if err := config.DB.Where("token=?", token).First(&user).Error; err != nil {
   c.JSON(401, gin.H{"error": "Invalid token"})
   c.Abort()
   return
  }
  c.Set("user", user)
  c.Next()
 }
}
