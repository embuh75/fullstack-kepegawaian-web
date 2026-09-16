# Frontend - Sistem Kepegawaian SMA

Starter project React + Vite untuk konsumsi API backend PHP Native.

## Cara menjalankan

1. Install dependency:
   ```bash
   npm install
   ```

2. Copy file environment:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan `VITE_API_URL` dengan `APP_URL` backend (lihat `backend/.env`).

3. Pastikan backend (XAMPP/Apache) sudah jalan duluan.

4. Jalankan dev server:
   ```bash
   npm run dev
   ```
   Server akan jalan di `http://localhost:5173` (WAJIB port ini atau `5174`,
   karena backend hanya mengizinkan origin tersebut di `config/cors.php`).

## Struktur folder

```
src/
├── components/
│   ├── Layout.jsx          # Sidebar + navbar
│   └── ProtectedRoute.jsx  # Guard untuk halaman yang butuh login
├── context/
│   └── AuthContext.jsx     # State login global (token, user)
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Jabatan.jsx         # TODO: lengkapi CRUD
│   ├── Mapel.jsx           # TODO: lengkapi CRUD
│   └── Pegawai.jsx         # Sudah ada list + search + pagination
├── services/
│   ├── api.js              # Axios instance + auto attach token
│   ├── authService.js
│   └── pegawaiService.js
├── App.jsx                 # Routing utama
└── main.jsx
```

## Yang perlu dilengkapi selanjutnya

1. **Jabatan & Mapel**: bikin `jabatanService.js` & `mapelService.js` (pola sama
   seperti `pegawaiService.js`), lalu lengkapi halaman list + form tambah/edit/hapus.
2. **Form Tambah/Edit Pegawai**: gunakan `FormData` karena ada upload foto.
   Field yang wajib divalidasi mengikuti aturan di backend
   (`app/Helpers/RakitValidator/PegawaiValidator.php`).
3. **Dropdown Jabatan & Mapel** di form Pegawai — ambil datanya dari endpoint
   masing-masing.
4. **Halaman Register/Manajemen User** (kalau memang dibutuhkan sistem ini,
   endpoint `/auth/register` & `/auth/delete/{id}` sudah tersedia).

## Login untuk testing

Cek tabel `pengguna` di database backend untuk akun yang tersedia, atau minta
akun admin ke teman backend kamu.
