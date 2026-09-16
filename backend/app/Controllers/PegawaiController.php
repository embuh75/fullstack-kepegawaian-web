<?php

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\PegawaiModel;
use App\Helpers\Response;
use App\Helpers\RakitValidator\PegawaiValidator;
use App\Helpers\Upload;

class PegawaiController
{
    /**
     * Tambah data pegawai 
     */
    public function store()
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        // Validasi
        $validator = new PegawaiValidator()->create($_POST);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        $validatedData = $validator->getValidatedData();

        // save gambar jika ada dan masukin ke db
        if ($_FILES) {
            $upload = new Upload()->uploadImage('foto', 'foto');
            $validatedData['foto'] = $upload['fileName'];
        }

        $pegawai = PegawaiModel::create($validatedData)->load(['jabatan', 'mapel']);

        Response::success($pegawai, 'Data pegawai berhasil ditambahkan.');
    }

    /**
     * Ambil semua data pegawai 
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();

        $page = (int)($_GET['page'] ?? 1);
        $per_page = (int)($_GET['per_page'] ?? 10);
        $search = (string)($_GET['search'] ?? null);

        $query = PegawaiModel::with(['jabatan', 'mapel']);

        // cari nama,jabatan,mapel
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'LIKE', "%{$search}%")
                    ->orWhereHas('jabatan', function ($qj) use ($search) {
                        $qj->where('nama', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('mapel', function ($qm) use ($search) {
                        $qm->where('nama', 'LIKE', "%{$search}%");
                    });
            });
        }

        $pagination = $query->paginate($per_page, ['*'], 'page', $page);

        $items = array_map(function ($item) {
            if ($item['foto']) {
                $item['foto'] = [
                    'fileName' => $item['foto'],
                    'path' => $_ENV['APP_URL'] . '/uploads/foto/' . $item['foto']
                ];
            }
            return $item;
        }, $pagination->items());

        $pegawais = [
            'items' => $items,
            'pagination' => [
                'current_page' => $pagination->currentPage(),
                'last_page' => $pagination->lastPage(),
                'per_page' => $pagination->perPage(),
                'total' => $pagination->total(),
                'has_more' => $pagination->hasMorePages(),
            ]
        ];

        Response::success($pegawais, 'Data pegawai berhasil diambil.');
    }

    /**
     * Ambil data pegawai berdasarkan id 
     */
    public function find(int $id)
    {
        AuthMiddleware::authenticate();

        $pegawai = PegawaiModel::with(['jabatan', 'mapel'])->find($id);

        if (!$pegawai) Response::error('Data pegawai tidak ditemukan.', null, 404);

        if ($pegawai['foto']) {
            $pegawai['foto'] = [
                'fileName' => $pegawai['foto'],
                'path' => $_ENV['APP_URL'] . '/uploads/foto/' . $pegawai['foto']
            ];
        }

        Response::success($pegawai, 'Data pegawai berhasil ditemukan.');
    }

    /**
     * Ambil data pegawai berdasarkan id 
     */
    public function update(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        [$data, $_FILES] = request_parse_body();

        // cari pegawai yang mau diupdate
        $pegawais = PegawaiModel::with(['jabatan', 'mapel'])->find($id);
        if (!$pegawais) Response::error('Data pegawai tidak ditemukan.', null, 404);

        // Validasi
        $validator = new PegawaiValidator()->update($data, $id);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll());
        }

        $validatedData = $validator->getValidatedData();

        // update gambar jika ada dan masukin ke db
        if ($_FILES) {

            if ($pegawais['foto']) {
                Upload::deleteFile('uploads/foto/' . $pegawais['foto']);
            }

            $fileName = new Upload()->uploadImage('foto', 'foto');

            if (!$fileName['success'] == true) {
                Response::error('Validasi foto gagal.', $fileName['error']);
            }

            $validatedData['foto'] = $fileName['fileName'];
        }

        $pegawais->update($validatedData);

        Response::success($validatedData, 'Data pegawai berhasil diperbarui.');
    }

    /**
     * Hapus data pegawai berdasarkan id 
     */
    public function delete(int $id)
    {
        $user = AuthMiddleware::authenticate();
        RoleMiddleware::isAdmin($user);

        $pegawais = PegawaiModel::with(['jabatan', 'mapel'])->find($id);

        if (!$pegawais) Response::error('Data pegawai tidak ditemukan.', null, 404);

        if ($pegawais['foto']) {
            Upload::deleteFile('uploads/foto/' . $pegawais['foto']);
        }

        PegawaiModel::destroy($id);

        Response::success($pegawais, 'Data pegawai berhasil dihapus.', 200);
    }
}
