<?php

/**
 * Controller: User
 * Menangani registrasi, list user, cari(id), update, hapus user
 */

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Helpers\RakitValidator\AuthValidator;
use App\Models\PenggunaModel;
use App\Helpers\Upload;

class UserController
{
    /**
     * POST /api/auth/register
     * Register (tambah pengguna)
     */
    public function register()
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $pengguna = new PenggunaModel();

        // Validasi input
        $validator = new AuthValidator()->register($_POST);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll(), 400);
        }

        // siapkan data dan masukan db
        $data = $validator->getValidatedData();

        if ($_FILES) {
            $upload = new Upload()->uploadImage('foto', 'pengguna');
            $data['foto'] = $upload['fileName'];
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        unset($data['confirm_password']);

        $result = $pengguna->create($data);
        unset($result['password']);

        Response::success($result, 'Registrasi pengguna berhasil.');
    }

    /**
     * GET /api/v1/user/users
     * ambil semua data user
     */
    public function index(): void
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $page = (int)($_GET['page'] ?? 1);
        $per_page = (int)($_GET['per_page'] ?? 10);
        $search = (string)($_GET['search'] ?? '');

        $query = PenggunaModel::query();

        // cari nama
        if ($search) {
            $query->where('nama', 'LIKE', "%{$search}%");
        }

        $pagination = $query->paginate($per_page, ['*'], 'page', $page);

        $items = array_map(function ($item) {
            // buang data yg gak perlu tampilin ke client
            unset(
                $item['password'],
                $item['created_at'],
                $item['updated_at'],
                $item['deleted_at'],
                $item['status_aktif'],
                $item['last_login_at'],
                $item['email_verified_at'],
            );

            if ($item['foto']) {
                $item['foto'] = [
                    'fileName' => $item['foto'],
                    'path' => $_ENV['APP_URL'] . '/uploads/pengguna/' . $item['foto']
                ];
            }

            return $item;
        }, $pagination->items());


        $data = [
            'items' => $items,
            'pagination' => [
                'current_page' => $pagination->currentPage(),
                'last_page' => $pagination->lastPage(),
                'per_page' => $pagination->perPage(),
                'total' => $pagination->total(),
                'has_more' => $pagination->hasMorePages(),
            ]
        ];

        Response::success($data, 'Data pegawai berhasil diambil.');
    }

    /**
     * GET /api/v1/user/id
     * ambil data user dari id
     */
    public function find(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $user = new PenggunaModel()->find($id);

        // buang data yg gak perlu tampilin ke client
        unset(
            $user['password'],
            $user['created_at'],
            $user['updated_at'],
            $user['deleted_at'],
            $user['status_aktif'],
            $user['last_login_at'],
            $user['email_verified_at'],
        );

        if (!$user) Response::error('Data pegawai tidak ditemukan.', null, 404);

        if ($user['foto']) {
            $user['foto'] = [
                'fileName' => $user['foto'],
                'path' => $_ENV['APP_URL'] . '/uploads/foto/pengguna/' . $user['foto']
            ];
        }

        Response::success($user, 'Data pegawai berhasil ditemukan.');
    }

    public function update(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        [$data, $_FILES] = request_parse_body();

        // cari pegawai yang mau diupdate
        $pengguna = PenggunaModel::find($id);
        if (!$pengguna) Response::error('Data pegawai tidak ditemukan.', null, 404);

        // Validasi
        $validator = new AuthValidator()->update($data, $id);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        $validatedData = $validator->getValidatedData();

        // update gambar jika ada dan masukin ke db
        if ($_FILES) {

            if ($pengguna['foto']) {
                Upload::deleteFile('uploads/pengguna/' . $pengguna['foto']);
            }

            $fileName = new Upload()->uploadImage('foto', 'pengguna');

            if (!$fileName['success'] == true) {
                Response::error('Validasi foto gagal.', $fileName['error']);
            }

            $validatedData['foto'] = $fileName['fileName'];
        }

        $pengguna->update($validatedData);

        Response::success($validatedData, 'Data pegawai berhasil diperbarui.');
    }

    /**
     * DEL /api/auth/delete
     * Delete (hapus pengguna)
     */
    public function delete(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $model = new PenggunaModel();
        $pengguna = $model->find($id);

        if (!$pengguna) {
            Response::error('Pengguna tidak ditemukan.', null, 404);
        }

        $model->destroy($id);

        Response::success('Data jabatan berhasil dihapus.');
    }
};