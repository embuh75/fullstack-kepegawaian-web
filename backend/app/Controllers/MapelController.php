<?php

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\MapelModel;
use App\Helpers\RakitValidator\MapelValidator;
use App\Helpers\Response;

class MapelController
{
    /**
     * Tambah data mapel
     */
    public function store(): void
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        // Validasi input
        $validator = new MapelValidator()->create($_POST);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        $data = $validator->getValidatedData();

        $mapel = MapelModel::create($data);

        Response::success($mapel, 'Data mapel berhasil ditambahkan.');
    }

    /**
     * Ambil semua data mapel
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();

        $page = (int)($_GET['page'] ?? 1);
        $per_page = (int)($_GET['per_page'] ?? 5);
        $search = (string)($_GET['search'] ?? null);

        // cari nama mapel
        if ($search) {
            $mapel = MapelModel::where('nama', 'LIKE', "%{$search}%")->first();
        } else {
            $mapel = MapelModel::paginate($per_page, ['*'], 'page', $page)->items();
        }

        // ada mapel ato tidak
        if (!$mapel) {
            Response::error('Nama mapel tidak ditemukan.', null, 404);
        }

        Response::success($mapel, 'mapel berhasil diambil');
    }

    /**
     * Ambil data mapel berdasarkan id 
     */
    public function find(int $id)
    {
        AuthMiddleware::authenticate();

        $mapel = MapelModel::find($id);

        // ada mapel ato tidak
        if (!$mapel) {
            Response::error('Nama mapel tidak ditemukan.', null, 404);
        }

        Response::success($mapel, 'mapel berhasil diambil');
    }

    /**
     * Update data mapel berdasarkan id 
     */
    public function update(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $model = new MapelModel()->find($id);

        // cek mapel adda tidak
        if (!$model) Response::error('Data mapel tidak ditemukan.', null, 404);

        // validasi
        [$data] = request_parse_body();
        $validator = new MapelValidator()->update($data, $id);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        // proses ke db dan lempar response
        $data = $validator->getValidatedData();
        $model->update($data);
        $result = $model->refresh();

        Response::success($result, 'Data mapel berhasil diperbarui.');
    }

    /**
     * Update data mapel berdasarkan id 
     */
    public function delete(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $mapel = MapelModel::find($id);

        // cek mapel adda tidak
        if (!$mapel) Response::error('Data mapel tidak ditemukan.', null, 404);

        $mapel->destroy($id);

        Response::success($mapel, 'Data mapel berhasil dihapus.');
    }
}
