<?php

/**
 * Controller: Auth
 * Menangani registrasi, login, dan logout
 */

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Helpers\RakitValidator\AuthValidator;
use App\Models\PenggunaModel;

class AuthController
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
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        unset($data['confirm_password']);

        $result = $pengguna->create($data);
        unset($result['password']);

        Response::success($result, 'Registrasi pengguna berhasil.');
    }

    /**
     * POST /api/auth/login
     * Login dan return JWT token
     */
    public function login(): void
    {
        $data = json_decode(file_get_contents('php://input'),true) ?? [];
        // $data = $_POST;

        // Validasi input
        $validator = new AuthValidator()->login($data);

        if ($validator->fails()) {
            Response::error('Validasi gagal.', $validator->errors()->firstOfAll(), 400);
        }

        $email = $data['email'] ?? '';
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $db = getDB();

        // batas percobaan login
        $maxAttempts = $_ENV['AUTH_MAX_ATTEMPT'] ?? 15;
        $lockoutDurationMinutes = $_ENV['AUTH_COOLDOWN'] ?? 2;

        // Cek jumlah percobaan login gagal dalam 15 menit terakhir
        $stmt = $db->prepare(
            "SELECT COUNT(*) as attempts 
           FROM login_attempts 
           WHERE (email = :email OR ip_address = :ip)
           AND attempted_at > DATE_SUB(NOW(), INTERVAL $lockoutDurationMinutes MINUTE)"
        );
        $stmt->execute([
            'email' => $email,
            'ip' => $ipAddress
        ]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($result && $result['attempts'] >= $maxAttempts) {
            Response::error("Terlalu banyak percobaan login. Silakan coba lagi dalam {$lockoutDurationMinutes} menit.", null, 429);
        }

        // Cari pengguna
        $penggunaModel = new PenggunaModel();
        $pengguna = $penggunaModel->where('email', $email)->first();

        if (!$pengguna || !password_verify($data['password'], $pengguna['password'])) {
            // Jika login gagal, catat percobaan
            $stmt = $db->prepare(
                "INSERT INTO login_attempts (email, ip_address) VALUES (:email, :ip)"
            );
            $stmt->execute([
                'email' => $email,
                'ip' => $ipAddress
            ]);

            Response::error('Email atau password salah.', null, 401);
        }

        if ($pengguna['deleted_at'] !== null) {
            Response::error('Akun Anda telah dihapus oleh Admin.', null, 401);
        }

        // Jika login berhasil, hapus riwayat percobaan
        $stmt = $db->prepare("DELETE FROM login_attempts WHERE email = :email");
        $stmt->execute(['email' => $email]);

        $pengguna->last_login_at = date('Y-m-d H:i:s');
        $pengguna->save();

        // Generate JWT token
        $token = AuthMiddleware::generateToken([
            'id'    => $pengguna['id'],
            'email' => $pengguna['email'],
            'role'  => $pengguna['role']
        ]);

        Response::success([
            'token' => $token,
            'user'  => [
                'id'           => $pengguna['id'],
                'nama'         => $pengguna['nama'],
                'email'        => $pengguna['email'],
                'role'         => $pengguna['role']
            ]
        ], 'Login berhasil.');
    }

    public function me(): void
    {
        try {
            $userData = AuthMiddleware::authenticate();
            $penggunaModel = new PenggunaModel();
            $user = $penggunaModel->find($userData->id);

            if (!$user) {
                Response::error('User tidak ditemukan', null, 404);
            }

            $user = [
                'user' => [
                    'id' => $user['id'],
                    'nama' => $user['nama'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'status_aktif' => $user['status_aktif']
                ]
            ];

            Response::success($user, 'Token valid.');
        } catch (\Exception $e) {
            Response::error('Sesi tidak valid', null, 401);
        }
    }


    /* public function logout(): void
    {
        // Validasi token
        AuthMiddleware::authenticate();

        // Di versi awal, logout cukup di handle di sisi client
        // dengan menghapus token dari localStorage
        Response::success(null, 'Logout berhasil.');
    } */

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
}
