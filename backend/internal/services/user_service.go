package services

import (
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"golang.org/x/crypto/bcrypt"

)

type UserService struct {
	Repo repositories.UserRepository
}

func (s *UserService) GetAll(users *[]models.User) error {
	return s.Repo.FindAll(users)
}

func (s *UserService) GetByID(user *models.User, id uint) error {
	return s.Repo.FindByID(user, id)
}

func (s *UserService) Create(user *models.User) error {
	hashed, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	user.Password = string(hashed)
	return s.Repo.Create(user)
}


func (s *UserService) Update(user *models.User) error {
	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword(
			[]byte(user.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return err
		}
		user.Password = string(hashed)
	} else {
		s.Repo.DB.Model(user).Omit("password").Updates(user)
		return nil
	}

	return s.Repo.Update(user)
}


func (s *UserService) Delete(user *models.User) error {
	return s.Repo.Delete(user)
}
