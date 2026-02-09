# GoReact Frontend Documentation

## Overview
Frontend dari aplikasi GoReact adalah sebuah Single Page Application (SPA) yang dibangun menggunakan React dan Vite. Frontend ini menyediakan antarmuka pengguna yang interaktif untuk berinteraksi dengan backend API, termasuk fitur login, manajemen user, profil, dan postingan.

## Teknologi yang Digunakan
- **React**: Library JavaScript untuk membangun UI
- **Vite**: Build tool untuk pengembangan cepat
- **Tailwind CSS**: Framework CSS untuk styling
- **localStorage**: Penyimpanan data sisi klien
- **Fetch API**: Komunikasi HTTP dengan backend

## Struktur Direktori
```
frontend/
├── public/
├── src/
│   ├── components/                 # Komponen React
│   │   ├── layout/
│   │   │   ├── HeaderBar.jsx      # Header dengan jam & cuaca
│   │   │   ├── Sidebar.jsx        # Sidebar navigasi
│   │   │   └── Layout.jsx         # Layout utama
│   │   ├── Login.jsx              # Halaman login
│   │   ├── UserList.jsx           # Daftar user
│   │   ├── UserForm.jsx           # Form user (create/update)
│   │   ├── UserProfile.jsx        # Profil user (dengan edit)
│   │   └── UserPosts.jsx          # Postingan user
│   ├── App.jsx                    # Komponen utama
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Styling global
├── package.json                   # Dependency frontend
├── vite.config.js                 # Konfigurasi Vite
├── tailwind.config.js             # Konfigurasi Tailwind
├── postcss.config.js              # Konfigurasi PostCSS
```

## Arsitektur
Frontend mengikuti prinsip component-based architecture dengan struktur sebagai berikut:

### 1. Komponen Utama
- **App.jsx**: Komponen induk yang mengelola state login/logout
- **Layout.jsx**: Struktur layout utama aplikasi
- **HeaderBar.jsx**: Header aplikasi dengan jam dan cuaca
- **Sidebar.jsx**: Sidebar navigasi dengan informasi user

### 2. Komponen Fitur
- **Login.jsx**: Form login dan otentikasi
- **UserList.jsx**: Menampilkan daftar user
- **UserForm.jsx**: Form untuk membuat/mengedit user
- **UserProfile.jsx**: Menampilkan dan mengedit profil user
- **UserPosts.jsx**: Menampilkan postingan user

## Alur Kerja

### 1. Startup
1. Aplikasi dijalankan dengan `npm run dev`
2. Vite menginisialisasi development server
3. React app dimuat di browser

### 2. Proses Login
```
Login Component → API Call (/api/login) → Store Token → Redirect Dashboard
```

Langkah-langkah:
1. User mengisi form login (username/password)
2. Komponen Login mengirim request ke `/api/login`
3. Backend memvalidasi kredensial
4. Jika valid, backend mengembalikan JWT token
5. Frontend menyimpan token dan info user di localStorage
6. Frontend memanggil callback `onLogin()` untuk memberi tahu App
7. App merubah state menjadi logged in
8. Tampilan berubah dari Login ke Dashboard

### 3. Dashboard & Navigasi
- Setelah login, menampilkan Layout dengan Sidebar dan Header
- Sidebar menampilkan menu dan info user
- Header menampilkan jam, cuaca, dan menu user
- Komponen UserList, UserForm, UserProfile aktif

### 4. Komunikasi API
Semua komunikasi dengan backend menggunakan:
- Fetch API
- Endpoint: `http://localhost:8081/api/`
- Authorization header dengan Bearer token
- Format JSON untuk request/response

### 5. State Management
- State login/logout dikelola di App.jsx
- State form dan list dikelola di masing-masing komponen
- Data user disimpan di localStorage

## Fitur Utama

### 1. Sistem Login
- Form login dengan validasi
- Penyimpanan session di localStorage
- Redirect otomatis setelah login
- Logout functionality

### 2. Manajemen User
- Tabel daftar user
- Form untuk membuat user baru
- Form untuk mengedit user
- Detail user dan profil

### 3. Profil User
- Tampilan informasi profil
- Form edit profil lengkap
- Field: phone, address, bio, website, company, position

### 4. Header Dinamis
- Tampilan jam real-time
- Informasi cuaca
- Menu pengguna dengan dropdown

### 5. Sidebar Personalisasi
- Menampilkan nama dan email pengguna
- Menu navigasi

## Komponen Penting

### HeaderBar.jsx
- Menampilkan jam dan cuaca secara real-time
- Ikon notifikasi dengan badge
- Menu dropdown pengguna
- Menampilkan nama pengguna yang sedang login

### Sidebar.jsx
- Menu navigasi
- Informasi pengguna yang sedang login
- Toggle untuk mobile/desktop

### Login.jsx
- Form login dengan username/password
- Validasi input
- Loading indicator
- Error handling

### UserProfile.jsx
- Tampilan profil user
- Mode view dan edit
- Field-field profil lengkap

## Styling
- Menggunakan Tailwind CSS untuk styling
- Responsive design
- Komponen-komponen yang reusable
- Konsistensi desain UI

## Environment dan Konfigurasi

### Proxy API
- API calls di-proxy ke `http://localhost:8081`
- Konfigurasi di `vite.config.js`

### Tailwind CSS
- Konfigurasi di `tailwind.config.js`
- Custom CSS di `index.css` dan `custom.css`

## Setup dan Instalasi

### Prasyarat
- Node.js 16+
- npm atau yarn

### Langkah-langkah
1. Clone repository
2. Masuk ke direktori frontend
3. Install dependency: `npm install`
4. Jalankan development server: `npm run dev`
5. Akses aplikasi di `http://localhost:5173`

### Dependency Utama
- `react`: Library utama
- `react-dom`: DOM renderer
- `tailwindcss`: Framework CSS
- `@tailwindcss/postcss`: Plugin PostCSS

## Keamanan
- Token disimpan di localStorage (untuk development)
- Validasi input di sisi client
- Sanitasi data sebelum dikirim ke backend

## Error Handling
- Error boundary untuk komponen
- Validasi form
- Error messages untuk API calls
- Loading states

## Deployment
- Build production: `npm run build`
- Output di direktori `dist/`
- Siap di-deploy ke static hosting