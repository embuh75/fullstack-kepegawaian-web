<?php
/**
 * Role Middleware
 * Validasi role pengguna
 */

namespace App\Middleware;

use App\Helpers\Response;

class RoleMiddleware
{
    /**
     * Pastikan pengguna adalah admin
     */
    public static function isAdmin(object $user): void
    {
        if (!isset($user->role) || $user->role !== 'admin') {
            Response::error('Akses ditolak. Hanya admin yang diperbolehkan.', null, 403);
        }
    }

    /**
     * Pastikan pengguna adalah siswa
     */
    public static function isSiswa(object $user): void
    {
        if (!isset($user->role) || $user->role !== 'siswa') {
            Response::error('Akses ditolak. Hanya siswa yang diperbolehkan.', null, 403);
        }
    }
}
