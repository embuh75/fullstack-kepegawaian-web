# 🏢 Backend Aplikasi Kepegawaian

Backend REST API untuk sistem manajemen kepegawaian, dibangun dengan **Node.js + Express + MySQL + Prisma ORM**.

---

## ✨ Fitur

- 🔐 **Autentikasi JWT** — Access Token (15m) + Refresh Token (7d) dengan rotasi otomatis
- 🛡️ **RBAC** — Role-Based Access Control dengan permission granular per modul
- 🗄️ **MySQL + Prisma ORM** — Type-safe database queries & auto-generated migrations
- 🚦 **Rate Limiting** — Proteksi dari request berlebihan
- 🪖 **Helmet** — Security HTTP headers
- 📝 **Logging** — Winston logger (file + console)
- ✅ **Validasi Request** — express-validator

---

## 🏗️ Struktur Project

```
kepegawaian-backend/
├── prisma/
│   ├── schema.prisma       # Schema database (Model & Relasi)
│   └── seed.js             # Data awal (roles, permissions, admin)
├── src/
│   ├── config/
│   │   ├── database.js     # Prisma Client singleton
│   │   └── jwt.js          # Konfigurasi JWT
│   ├── controllers/        # Request handler
│   │   ├── authController.js
│   │   └── pegawaiController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js   # Verifikasi JWT
│   │   ├── rbacMiddleware.js   # Cek permission/role
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   └── pegawaiRoutes.js
│   ├── services/           # Business logic
│   │   ├── authService.js
│   │   └── pegawaiService.js
│   ├── utils/
│   │   ├── logger.js       # Winston logger
│   │   └── response.js     # Standar format response API
│   └── app.js              # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Cara Menjalankan

### 1. Clone & Install

```bash
git clone <repo-url>
cd kepegawaian-backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Jalankan migrasi database
npm run db:migrate

# Isi data awal (roles, permissions, user admin)
npm run db:seed
```

### 4. Jalankan Server

```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Server berjalan di: `http://localhost:3000`

---

## 📡 API Endpoints & Request

Base URL: `http://localhost:3000/api/v1`

> Semua endpoint yang butuh Auth wajib menyertakan header:
> `Authorization: Bearer <access_token>`

---

### 🔐 AUTH

#### POST `/auth/login`

Login dan mendapatkan token.

**Body:**

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@kepegawaian.id",
      "role": "ADMIN",
      "permissions": ["pegawai:read", "pegawai:create", "..."]
    }
  }
}
```

---

#### POST `/auth/refresh`

Perbarui access token yang sudah expired menggunakan refresh token.

**Body:**

```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token diperbarui",
  "data": {
    "accessToken": "eyJhbGci...TOKEN_BARU",
    "refreshToken": "eyJhbGci...REFRESH_BARU"
  }
}
```

---

#### POST `/auth/logout`

🔒 Auth required

**Body:**

```json
{
  "refreshToken": "eyJhbGci..."
}
```

---

#### GET `/auth/me`

🔒 Auth required — Lihat info user yang sedang login. Tidak butuh body.

---

#### PUT `/auth/change-password`

🔒 Auth required

**Body:**

```json
{
  "passwordLama": "Admin@123",
  "passwordBaru": "AdminBaru@456"
}
```

> `passwordBaru` minimal 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka.

---

### 👤 PEGAWAI

#### GET `/pegawai`

🔒 Auth + Permission: `pegawai:read`

**Query Params (semua opsional):**

| Param          | Tipe   | Contoh  | Keterangan                     |
| -------------- | ------ | ------- | ------------------------------ |
| `page`         | number | `1`     | Halaman (default: 1)           |
| `limit`        | number | `10`    | Data per halaman (default: 10) |
| `search`       | string | `budi`  | Cari by nama atau NIP          |
| `departemenId` | number | `1`     | Filter by departemen           |
| `jabatanId`    | number | `2`     | Filter by jabatan              |
| `statusKerja`  | string | `AKTIF` | Filter by status               |

**Contoh:**

```
GET /api/v1/pegawai?page=1&limit=10
GET /api/v1/pegawai?search=budi
GET /api/v1/pegawai?departemenId=1&statusKerja=AKTIF
```

---

#### GET `/pegawai/:id`

🔒 Auth + Permission: `pegawai:read`

**Params:** `id` — ID pegawai

**Contoh:** `GET /api/v1/pegawai/1`

---

#### POST `/pegawai`

🔒 Auth + Permission: `pegawai:create`

**Body:**

```json
{
  "nama": "Nama Orang",
  "noKTP": "10292938393",
  "noNBM": "1234567",
  "foto": "foto.png",
  "tempatLahir": "Cilacap",
  "tanggalLahir": "1977-07-10",
  "jenisKelamin": "L",
  "status": "MENIKAH",
  "alamatRumah": "alamat....",
  "nomorTelephone": "802929292",
  "alamatEmail": "email@email.com",
  "pendidikanTerakhir": "S2",
  "namaKampus": "nama univ",
  "jurusan": "jurusan univ",
  "tahunLulus": 2018,
  "jabatanId": 5,
  "mataPelajaranIds": [3],
  "nomorBpjs": "",
  "kontakDarurat": "089898923"
}
```

**Keterangan field:**

| Field          | Wajib | Tipe   | Keterangan                |
| -------------- | ----- | ------ | ------------------------- |
| `nip`          | ✅    | string | Nomor Induk Pegawai, unik |
| `nama`         | ✅    | string | Nama lengkap              |
| `tempatLahir`  | ✅    | string | Kota tempat lahir         |
| `tanggalLahir` | ✅    | string | Format: `YYYY-MM-DD`      |
| `jenisKelamin` | ✅    | string | `L` atau `P`              |
| `alamat`       | ✅    | string | Alamat lengkap            |
| `departemenId` | ✅    | number | ID departemen             |
| `jabatanId`    | ✅    | number | ID jabatan                |
| `tanggalMasuk` | ✅    | string | Format: `YYYY-MM-DD`      |
| `noTelp`       | ❌    | string | Nomor telepon             |
| `email`        | ❌    | string | Format email valid        |
| `statusKerja`  | ❌    | string | Default: `AKTIF`          |
| `gajiPokok`    | ❌    | string | Nominal gaji              |

---

#### PUT `/pegawai/:id`

🔒 Auth + Permission: `pegawai:update`

**Params:** `id` — ID pegawai

**Body (semua opsional, isi yang ingin diubah saja):**

```json
{
  "nama": "Budi Santoso Updated",
  "alamat": "Jl. Sudirman No. 5, Purwokerto",
  "noTelp": "08199999999",
  "jabatanId": 3,
  "statusKerja": "AKTIF",
  "gajiPokok": "6000000"
}
```

---

#### DELETE `/pegawai/:id`

🔒 Auth + Permission: `pegawai:delete`

**Params:** `id` — ID pegawai

**Contoh:** `DELETE /api/v1/pegawai/1`

---

### 🩺 Health Check

#### GET `/health`

Cek status server. Tidak butuh auth.

**Response:**

```json
{
  "status": "OK",
  "service": "Kepegawaian API",
  "time": "2024-01-01T00:00:00.000Z"
}
```

---

## 📋 Referensi Nilai

### Jenis Kelamin

| Nilai | Keterangan |
| ----- | ---------- |
| `L`   | Laki-laki  |
| `P`   | Perempuan  |

### Status Kerja

| Nilai     | Keterangan            |
| --------- | --------------------- |
| `AKTIF`   | Pegawai aktif bekerja |
| `CUTI`    | Sedang cuti           |
| `RESIGN`  | Mengundurkan diri     |
| `PENSIUN` | Pensiun               |

### Departemen (seed default)

| ID  | Kode | Nama                |
| --- | ---- | ------------------- |
| 1   | IT   | Teknologi Informasi |
| 2   | HRD  | Human Resources     |
| 3   | FIN  | Keuangan            |
| 4   | OPS  | Operasional         |

### Jabatan (seed default)

| ID  | Kode  | Nama          | Grade |
| --- | ----- | ------------- | ----- |
| 1   | DIR   | Direktur      | A1    |
| 2   | MAN   | Manager       | B1    |
| 3   | SPV   | Supervisor    | B2    |
| 4   | STAFF | Staff         | C1    |
| 5   | INT   | Intern/Magang | D1    |

---

## 🔑 Roles & Permissions Default

| Role      | Permissions                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| `ADMIN`   | Semua permission                                                                 |
| `MANAGER` | `pegawai:read`, `pegawai:update`, `jabatan:read`, `departemen:read`, `user:read` |
| `PEGAWAI` | `pegawai:read`, `jabatan:read`, `departemen:read`                                |

---

## 👤 User Admin Default

Setelah `npm run db:seed`:

```
Username : admin
Password : Admin@123
```

> ⚠️ **Ganti password segera setelah pertama kali login!**

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Logging**: Winston
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
