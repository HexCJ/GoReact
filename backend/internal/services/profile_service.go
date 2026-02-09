package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
)

type ProfileService struct {
	Repo repositories.ProfileRepository
}

func (s *ProfileService) Create(profile *models.Profile) error {
	return s.Repo.Create(profile)
}

func (s *ProfileService) Update(profile *models.Profile) error {
	return s.Repo.Update(profile)
}

func (s *ProfileService) GetByUserID(profile *models.Profile, userID uint) error {
	return s.Repo.FindByUserID(profile, userID)
}
