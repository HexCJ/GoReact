package handlers

import (
	"net/http"
	"strconv"

	"gin-user-api/internal/models"
	"gin-user-api/internal/services"
	"gin-user-api/internal/repositories" 

	"github.com/gin-gonic/gin"

	"gorm.io/gorm"
)

type PostHandler struct {
	Service services.PostService
}

func NewPostHandler(db *gorm.DB) PostHandler {
	repo := repositories.PostRepository{DB: db}
	service := services.PostService{Repo: repo}
	return PostHandler{Service: service}
}

func (h *PostHandler) GetPosts(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("id"))
	var posts []models.Post
	h.Service.GetAll(&posts, uint(userID))
	c.JSON(http.StatusOK, posts)
}

func (h *PostHandler) GetPost(c *gin.Context) {
	postID, _ := strconv.Atoi(c.Param("post_id"))
	var post models.Post
	if err := h.Service.GetByID(&post, uint(postID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("id"))
	var post models.Post
	c.ShouldBindJSON(&post)
	post.UserID = uint(userID)
	h.Service.Create(&post)
	c.JSON(http.StatusCreated, post)
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
	postID, _ := strconv.Atoi(c.Param("post_id"))
	var post models.Post
	h.Service.GetByID(&post, uint(postID))
	c.ShouldBindJSON(&post)
	h.Service.Update(&post)
	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	postID, _ := strconv.Atoi(c.Param("post_id"))
	h.Service.Delete(uint(postID))
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
