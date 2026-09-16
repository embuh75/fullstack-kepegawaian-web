<?php

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\JabatanModel;
use App\Helpers\Response;
use App\Helpers\RakitValidator\JabatanValidator;

class JabatanController
{
    /**
     * Tambah data jabatan
     */
    public function store(): void
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $data = json_decode(file_get_contents('php://input'),true) ?? [];

        // Validasi input
        $validator = new JabatanValidator()->create($data);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        $validatedData = $validator->getValidatedData();

        $jabatan = JabatanModel::create($validatedData);

        Response::success($jabatan, 'Data jabatan berhasil ditambahkan.');
    }

    /**
     * Ambil semua data Jabatan 
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();

        $page = (int)($_GET['page'] ?? 1);
        $per_page = (int)($_GET['per_page'] ?? 5);
        $search = (string)($_GET['search'] ?? null);

        // cari nama jabatan
        if ($search) {
            $jabatan = JabatanModel::where('nama', 'LIKE', "%{$search}%")->first();
        } else {
            $jabatan = JabatanModel::paginate($per_page, ['*'], 'page', $page)->items();
        }

        // ada jabatan ato tidak
        if (!$jabatan) {
            Response::error('Nama jabatan tidak ditemukan.', null, 404);
        }

        Response::success($jabatan, 'jabatan berhasil diambil');
    }

    /**
     * Ambil data jabatan berdasarkan id 
     */
    public function find(int $id)
    {
        AuthMiddleware::authenticate();

        $jabatan = JabatanModel::find($id);

        // ada jabatan ato tidak
        if (!$jabatan) {
            Response::error('Nama jabatan tidak ditemukan.', null, 404);
        }

        Response::success($jabatan, 'jabatan berhasil diambil');
    }

    /**
     * Update data jabatan berdasarkan id 
     */
    public function update(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $model = new JabatanModel()->find($id);

        if (!$model) Response::error('Data jabatan tidak ditemukan.', null, 404);

        // validasi input
        [$data] = request_parse_body();
        $validator = new JabatanValidator()->update($data, $id);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        // proses ke db dan lempar response
        $data = $validator->getValidatedData();
        $model->update($data);
        $result = $model->refresh();

        Response::success($result, 'Data jabatan berhasil diperbarui.');
    }

    /**
     * Update data jabatan berdasarkan id 
     */
    public function delete(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $jabatan = JabatanModel::find($id);

        // cek jabatan adda tidak
        if (!$jabatan) Response::error('Data jabatan tidak ditemukan.', null, 404);

        JabatanModel::destroy($id);

        Response::success($jabatan, 'Data jabatan berhasil dihapus.');
    }
}
