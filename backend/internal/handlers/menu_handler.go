package handlers

import (
	"net/http"
	"strconv"

	"gin-user-api/internal/services"
	"gin-user-api/internal/dto"
	"github.com/gin-gonic/gin"
)

type MenuHandler struct {
	Service *services.MenuService
}

func NewMenuHandler(service *services.MenuService) *MenuHandler {
	return &MenuHandler{Service: service}
}

func (h *MenuHandler) GetAll(c *gin.Context) {
	menus, err := h.Service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	response := make([]dto.MenuResponse, 0)

	for _, m := range menus {

		menuResp := dto.MenuResponse{
			ID:         m.ID,
			NamaMenu:   m.NamaMenu,
			LevelMenu:  m.LevelMenu,
			ApiMenu:    m.ApiMenu,
			UrlMenu:    m.UrlMenu,
			Icon:       m.Icon,
			NoUrut:     m.NoUrut,
			StatusMenu: m.StatusMenu,
			MasterMenu: m.MasterMenu,
			Permissions: make([]dto.PermissionResponse, 0), 
		}

		for _, p := range m.Permissions {
			menuResp.Permissions = append(menuResp.Permissions, dto.PermissionResponse{
				ID:   p.ID,
				Nama: p.Nama,
			})
		}

		response = append(response, menuResp)
	}

	c.JSON(http.StatusOK, response)
}



func (h *MenuHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	menu, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	response := dto.MenuResponse{
		ID:         menu.ID,
		NamaMenu:   menu.NamaMenu,
		LevelMenu:  menu.LevelMenu,
		ApiMenu:    menu.ApiMenu,
		UrlMenu:    menu.UrlMenu,
		Icon:       menu.Icon,
		NoUrut:     menu.NoUrut,
		StatusMenu: menu.StatusMenu,
		MasterMenu: menu.MasterMenu,
	}

	for _, p := range menu.Permissions {
		response.Permissions = append(response.Permissions, dto.PermissionResponse{
			ID:   p.ID,
			Nama: p.Nama,
		})
	}

	c.JSON(http.StatusOK, response)
}


func (h *MenuHandler) Create(c *gin.Context) {
	var req dto.CreateMenuRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.Create(req); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "Menu created"})
}


func (h *MenuHandler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var req dto.UpdateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.Update(uint(id), req); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Menu updated"})
}



func (h *MenuHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	if err := h.Service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Menu deleted"})
}
