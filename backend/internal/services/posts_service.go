package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
)

type PostService struct {
	Repo repositories.PostRepository
}

func (s *PostService) GetAll(posts *[]models.Post, userID uint) error {
	return s.Repo.FindAll(posts, userID)
}

func (s *PostService) GetByID(post *models.Post, id uint) error {
	return s.Repo.FindByID(post, id)
}

func (s *PostService) Create(post *models.Post) error {
	return s.Repo.Create(post)
}

func (s *PostService) Update(post *models.Post) error {
	return s.Repo.Update(post)
}

func (s *PostService) Delete(id uint) error {
	return s.Repo.Delete(id)
}
