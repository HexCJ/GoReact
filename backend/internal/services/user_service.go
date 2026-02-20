package services

import (
	"gin-user-api/internal/dto"
	"gin-user-api/internal/models"
	"gin-user-api/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	Repo repositories.UserRepository
}

func (s *UserService) GetAll() ([]models.User, error) {
	var users []models.User
	err := s.Repo.FindAll(&users)
	return users, err
}

func (s *UserService) GetByID(id uint) (models.User, error) {
	var user models.User
	err := s.Repo.FindByID(&user, id)
	return user, err
}

func (s *UserService) Create(req dto.CreateUserRequest) error {
	hashed, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashed),
		RoleID:   req.RoleID,
	}

	return s.Repo.Create(&user)
}

func (s *UserService) Update(id uint, req dto.UpdateUserRequest) error {
	user, err := s.GetByID(id)
	if err != nil {
		return err
	}

	user.Name = req.Name
	user.Email = req.Email
	user.RoleID = req.RoleID

	if req.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword(
			[]byte(req.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return err
		}
		user.Password = string(hashed)
	}

	return s.Repo.Update(&user)
}

func (s *UserService) Delete(id uint) error {
	user, err := s.GetByID(id)
	if err != nil {
		return err
	}
	return s.Repo.Delete(&user)
}