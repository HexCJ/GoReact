# GoReact Backend Documentation

## Overview
Backend dari aplikasi GoReact adalah sebuah REST API yang dibangun menggunakan bahasa pemrograman Go dan framework Gin. Backend ini menyediakan endpoint-endpoint untuk manajemen user, profil, dan postingan, serta sistem otentikasi menggunakan JWT.

## Teknologi yang Digunakan
- **Go**: Bahasa pemrograman utama
- **Gin**: Framework web untuk Go
- **GORM**: ORM untuk interaksi database
- **PostgreSQL**: Database relasional
- **bcrypt**: Library untuk hashing password
- **JWT**: Token otentikasi
- **CORS**: Cross-Origin Resource Sharing

## Struktur Direktori
```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Entry point aplikasi
├── config/
│   └── config.go                   # Konfigurasi database
├── internal/
│   ├── handlers/                   # Handler HTTP
│   │   ├── user_handler.go         # CRUD user
│   │   ├── profile_handler.go      # CRUD profile
│   │   ├── posts_handler.go        # CRUD posts
│   │   └── auth_handler.go         # Login/autentikasi
│   ├── models/                     # Model database
│   │   ├── user.go
│   │   ├── profile.go
│   │   └── post.go
│   ├── repositories/               # Interaksi database
│   │   ├── user_repository.go
│   │   ├── profile_repository.go
│   │   └── posts_repository.go
│   ├── services/                   # Logika bisnis
│   │   └── user_service.go
│   └── routes/
│       └── routes.go               # Definisi routing
├── migrations/                     # Migration database
├── .env                           # Konfigurasi environment
├── go.mod, go.sum                 # Dependency management
```

## Arsitektur
Backend mengikuti arsitektur clean architecture dengan layer-layer berikut:

### 1. Handler Layer
- Menerima request HTTP
- Mengembalikan response HTTP
- Menghubungkan dengan service layer

### 2. Service Layer
- Berisi logika bisnis
- Menghubungkan handler dengan repository
- Contoh: hashing password

### 3. Repository Layer
- Berisi operasi CRUD ke database
- Menggunakan GORM untuk ORM
- Interface dengan database PostgreSQL

### 4. Model Layer
- Mendefinisikan struktur data
- Relasi antar tabel (User → Profile, User → Posts)

## Endpoint API

### Publik (tidak memerlukan otentikasi)
- `POST /api/login` - Login user

### Terlindungi (memerlukan JWT token)
- `GET /api/users` - Ambil semua user
- `POST /api/users` - Buat user baru
- `GET /api/users/{id}` - Ambil user berdasarkan ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Hapus user
- `POST /api/users/{id}/profile` - Buat profil user
- `PUT /api/users/{id}/profile` - Update profil user
- `GET /api/users/{id}/posts` - Ambil postingan user
- `POST /api/users/{id}/posts` - Buat postingan user
- `PUT /api/users/{id}/posts/{post_id}` - Update postingan
- `DELETE /api/users/{id}/posts/{post_id}` - Hapus postingan

## Sistem Otentikasi

### Login Flow
1. User mengirimkan username (email atau nama) dan password
2. Backend mencari user di database
3. Password di-verifikasi menggunakan bcrypt
4. Jika valid, JWT token dibuat dan dikembalikan
5. Token berisi informasi user (ID, email, nama) dan masa berlaku

### Middleware Otentikasi
- Memvalidasi JWT token dari header Authorization
- Menyimpan informasi user ke context
- Digunakan untuk melindungi endpoint sensitif

## Setup dan Instalasi

### Prasyarat
- Go 1.19+
- PostgreSQL

### Langkah-langkah
1. Clone repository
2. Masuk ke direktori backend
3. Install dependency: `go mod tidy`
4. Buat file `.env` dan konfigurasi database
5. Jalankan server: `go run ./cmd/server/main.go`

### Konfigurasi .env
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gingo_db
JWT_SECRET=supersecretkeyforjsonwebtoken
```

## Keamanan
- Password dihash menggunakan bcrypt
- Otentikasi menggunakan JWT dengan secret key
- Middleware melindungi endpoint sensitif
- CORS dikonfigurasi untuk hanya mengizinkan origin frontend

## Error Handling
- Response error dalam format JSON
- Kode status HTTP sesuai standar
- Pesan error informatif

## Logging
- Logging aktivitas server
- Error logging untuk debugging