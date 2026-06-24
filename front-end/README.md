# Frontend Kepegawaian (React + Vite + Tailwind + Zustand)

Frontend untuk REST API Kepegawaian, sesuai spesifikasi di
`Prompt_Pengembangan_Website_Kepegawaian.pdf`, dengan beberapa penyesuaian
berdasarkan audit langsung terhadap source backend (`kepegawaian-rest-api.zip`).

## Setup

```bash
npm install
cp .env.example .env   # sesuaikan VITE_API_BASE_URL
npm run dev
```

Default `.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Catatan Penting (Perbedaan dari PDF / Asumsi)

Setelah membaca source code backend (`src/`, `prisma/schema.prisma`,
`prisma/data.js`), ditemukan beberapa perbedaan dari spesifikasi PDF:

1. **`POST /auth/refresh` TIDAK mengembalikan objek `user`**, hanya
   `{ accessToken, refreshToken }`. PDF menyatakan ada `user`, tapi
   `authService.refresh()` di backend tidak mengirimkannya. Frontend
   menyimpan `user` dari login/`/auth/me` dan tidak menimpa saat refresh
   (lihat `src/store/authStore.js` - `setTokens` vs `setSession`).

2. **Tidak ada endpoint `GET /jabatan` atau `GET /mata-pelajaran`.**
   Tabel `Jabatan` dan `MataPelajaran` ada di schema, tapi tidak ada
   route/controller untuk membacanya. Sesuai kesepakatan, dropdown
   di-hardcode di `src/utils/masterData.js` berdasarkan urutan seed
   `prisma/data.js` (Jabatan id 1-5, MataPelajaran id 1-17).

   PERINGATAN: hardcode ini hanya benar jika database
   di-seed dari kosong tanpa modifikasi urutan. Sebelum dipakai dengan
   database nyata, jalankan:
   ```sql
   SELECT id, kode, nama FROM jabatan ORDER BY id;
   SELECT id, kode, nama FROM mata_pelajaran ORDER BY id;
   ```
   dan sesuaikan `src/utils/masterData.js` jika ID berbeda. Jika ID tidak
   cocok, request create/update pegawai akan gagal (foreign key constraint)
   atau menyimpan jabatan/mapel yang salah.

3. **Validasi `status` pernikahan**: schema Prisma punya enum
   `Belum_Menikah | Menikah | Duda`, tapi validator backend
   (`pegawaiRoutes.js`) hanya menerima `Belum_Menikah` atau `Menikah` saat
   create. Opsi "Duda" tidak ditampilkan di form (dikomentari di
   `masterData.js`) karena akan ditolak backend pada create.

4. **`PUT /pegawai/:id` tidak punya validator di backend** (tidak seperti
   `POST`). Frontend tetap memvalidasi semua field secara konsisten di
   sisi klien untuk UX yang baik, meski backend tidak memaksanya saat edit.

5. **CORS**: backend membaca `ALLOWED_ORIGINS` dari env. Pastikan origin
   frontend (misal `http://localhost:5173`) terdaftar di backend, atau
   semua request API akan gagal karena CORS.

## Struktur

- `src/api/` - axios client + service per modul (auth, pegawai). Client
  punya interceptor refresh-token otomatis dengan queue untuk request
  paralel.
- `src/store/authStore.js` - Zustand store untuk token, user, permissions
  (persist ke localStorage).
- `src/pages/` - Login, daftar/detail/form pegawai, profil, 403, 404.
- `src/layouts/MainLayout.jsx` - sidebar nav, RBAC-aware (menu hanya
  tampil jika user punya permission terkait).
- `src/components/ProtectedRoute.jsx` - guard route berdasarkan status
  login dan permission.
- `src/utils/masterData.js` - data master Jabatan & MataPelajaran
  (hardcoded, lihat poin 2 di atas).

## RBAC

Akses menu dan tombol aksi (tambah/edit/hapus) dikontrol oleh
`permissions` dari `/auth/me` / hasil login, dicocokkan dengan string
permission backend (`pegawai:read`, `pegawai:create`, `pegawai:update`,
`pegawai:delete`).

## Login default (dari seed)

```
username: fun
password: Entahlah123
```
