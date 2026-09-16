# SPMB Backend — SMA Muhammadiyah Sokaraja

Backend API untuk Sistem Penerimaan Murid Baru (SPMB) Online SMA Muhammadiyah Sokaraja, dibangun dengan **PHP Native** (tanpa framework).

## Tech Stack

- **PHP** ≥ 8.4 (Native, tanpa framework)
- **MySQL** — Database relasional
- **illuminate/database** — ORM database
- **rakit/validation** — Validator
- **JWT Authentication** — [firebase/php-jwt](https://github.com/firebase/php-jwt)
- **Composer** — Autoloading PSR-4 saja (tanpa framework)

## Cara Menjalankan (Development)

### Prasyarat

- [XAMPP/Laragon](https://www.apachefriends.org/) (Apache + MySQL + PHP ≥ 8.4)
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
   DB_NAME=kepegawaian_sma
   DB_USER=root
   DB_PASS=
   JWT_SECRET=ganti_dengan_secret_key_anda
   ```

4. **Import database** ke MySQL via phpMyAdmin:
   ```
   database/db_kepegawaian_sma.sql
   ```

5. **Install dependency Composer**:
   ```bash
   composer install
   ```

### Akun Admin Default

| Email | Password |
|-------|----------|
| `adminsma@gmail.com` | `admin1234` |

> ⚠️ **Segera ganti password admin** setelah pertama kali login.
