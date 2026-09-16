# SPMB Backend — SMA Muhammadiyah Sokaraja

Backend API untuk Sistem Penerimaan Murid Baru (SPMB) Online SMA Muhammadiyah Sokaraja, dibangun dengan **PHP Native** (tanpa framework).

## Tech Stack

- **PHP** ≥ 7.4 (Native, tanpa framework)
- **MySQL** — Database relasional
- **PDO** — Koneksi database native
- **JWT Authentication** — [firebase/php-jwt](https://github.com/firebase/php-jwt)
- **PhpSpreadsheet** — Export data ke Excel
- **Composer** — Autoloading PSR-4 saja (tanpa framework)

## Repository Terkait

- **Frontend**: [spmb-sma-frontend](https://github.com/USERNAME/spmb-sma-frontend) *(update link setelah repo dibuat)*

## Cara Menjalankan (Development)

### Prasyarat

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP ≥ 7.4)
- [Composer](https://getcomposer.org/)

### Langkah Instalasi

1. **Clone repository** ini ke dalam folder `htdocs`:
   ```bash
   cd C:\xampp\htdocs
   git clone https://github.com/USERNAME/spmb-sma-backend.git SPMB_SMA_backend
   ```

2. **Copy file environment**:
   ```bash
   cp .env.example .env
   ```

3. **Sesuaikan kredensial** di file `.env`:
   ```
   DB_NAME=spmb_sma
   DB_USER=root
   DB_PASS=
   JWT_SECRET=ganti_dengan_secret_key_anda
   ```

4. **Import database** ke MySQL via phpMyAdmin:
   ```
   database/spmb_database.sql
   ```

5. **Install dependency Composer**:
   ```bash
   composer install
   ```

6. **Pastikan Apache running** di XAMPP, lalu jalankan di terminal:
   ```
   composer run serve
   ```

### Akun Admin Default

| Email | Password |
|-------|----------|
| `adminsma@gmail.com` | `admin1234` |

> ⚠️ **Segera ganti password admin** setelah pertama kali login.

## Struktur Folder

```
SPMB_SMA_backend/
├── app/
│   ├── Config/            # Konfigurasi aplikasi
│   ├── Controllers/       # Controller (routing handler)
│   │   └── Admin/         # Controller khusus admin
│   ├── Core/              # Router custom buatan sendiri
│   ├── Exceptions/        # Custom exception classes
│   ├── Helpers/           # Helper functions (Response, Validator, Upload, Auth)
│   ├── Middleware/         # Auth & Role middleware (JWT)
│   └── Models/            # Model (query database via PDO)
├── config/                # File konfigurasi (database, JWT, CORS, env)
├── database/              # File SQL untuk setup database
├── docs/                  # Dokumentasi (opsional)
├── public/                # Entry point (index.php) & file uploads
│   ├── index.php          # Single entry point
│   └── uploads/           # Folder upload file user
├── routes/                # Definisi route API
│   ├── api.php            # Routes utama
│   └── admin.php          # Routes admin
└── storage/               # Storage internal (logs, cache)
```

## Arsitektur

Project ini menggunakan pola **MVC (Model-View-Controller) manual** yang dibangun dari nol:

- **Router** (`app/Core/Router.php`) — Routing manual dengan pattern matching
- **Controllers** — Menangani request dan response
- **Models** — Query database menggunakan PDO native (`prepare`, `execute`, `fetch`)
- **Middleware** — Autentikasi JWT dan otorisasi role
- **Helpers** — Fungsi utilitas (Response JSON, Validasi, Upload file)

## API Endpoints

### Publik (Tanpa Auth)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/register` | Registrasi siswa baru |
| GET | `/api/v1/publik/jadwal` | Jadwal pendaftaran |
| GET | `/api/v1/publik/galeri` | Galeri foto |
| GET | `/api/v1/publik/prestasi` | Daftar prestasi |
| GET | `/api/v1/publik/testimoni` | Testimoni alumni |
| GET | `/api/v1/pengumuman` | Pengumuman |

### Siswa (Butuh Auth)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/siswa/status` | Status pendaftaran |
| GET/POST | `/api/v1/siswa/pendaftaran` | Data pendaftaran |
| POST | `/api/v1/siswa/pendaftaran/submit` | Submit final |
| GET/POST | `/api/v1/siswa/berkas` | Upload berkas |
| GET/PUT | `/api/v1/profile` | Profil user |

### Admin (Butuh Auth + Role Admin)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/admin/dashboard/stats` | Statistik dashboard |
| GET | `/api/v1/admin/pendaftar` | Daftar pendaftar |
| PATCH | `/api/v1/admin/pendaftar/{id}/verifikasi` | Verifikasi pendaftar |
| GET | `/api/v1/admin/pendaftar/export/lengkap` | Export Excel |
| CRUD | `/api/v1/admin/jadwal` | Kelola jadwal |
| CRUD | `/api/v1/admin/galeri` | Kelola galeri |
| CRUD | `/api/v1/admin/prestasi` | Kelola prestasi |
| CRUD | `/api/v1/admin/testimoni` | Kelola testimoni |
| CRUD | `/api/v1/admin/pengumuman` | Kelola pengumuman |

## Keamanan

- ✅ **JWT Authentication** — Token-based auth dengan expiry
- ✅ **Rate Limiting** — 5x gagal login = blokir 15 menit
- ✅ **CORS Whitelist** — Hanya origin yang diizinkan
- ✅ **Input Validation** — Validasi di setiap endpoint
- ✅ **File Upload Security** — Validasi MIME type, ukuran, dan ekstensi file
- ✅ **SQL Injection Prevention** — Prepared statements (PDO)
- ✅ **Soft Delete** — Data tidak dihapus permanen

## Lisensi

Project ini dibuat untuk keperluan akademik — Tugas Akhir/Skripsi.
