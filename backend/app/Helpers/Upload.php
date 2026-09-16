<?php

/**
 * Upload Helper
 * Menangani upload file gambar
 */

namespace App\Helpers;

class Upload
{
    // Tipe file yang diizinkan
    private static array $allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    // Ekstensi yang diizinkan
    private static array $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    // Ukuran max (2MB)
    private static int $maxSize = 1 * 1024 * 1024;

    // Direktori upload
    private static string $uploadDir = __DIR__ . '/../../public/uploads/';

    /**
     * Upload file gambar
     *
     * @param string $fieldName Nama field di $_FILES
     * @param string $subDir    Sub-direktori dalam uploads/ (contoh: 'prestasi', 'jadwal')
     * @return array ['success' => bool, 'path' => string|null, 'error' => string|null]
     */
    public static function uploadImage(string $fieldName, string $subDir = ''): array
    {
        // Cek apakah file ada
        if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] === UPLOAD_ERR_NO_FILE) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => 'file kosong, pastikan cek kembali form file yang akan anda kirimkan.'
            ];
        }

        $file = $_FILES[$fieldName];

        // Cek error upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => 'Gagal mengupload file. Error code: ' . $file['error']
            ];
        }

        // Validasi tipe file
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, self::$allowedTypes)) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => 'Tipe file tidak diizinkan. Gunakan: JPG, PNG, WebP, atau GIF.'
            ];
        }

        // Validasi ekstensi
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, self::$allowedExtensions)) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => 'Ekstensi file tidak diizinkan.'
            ];
        }

        // Validasi ukuran
        if ($file['size'] > self::$maxSize) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => 'Ukuran file maksimal 1MB.'
            ];
        }

        // Buat direktori jika belum ada
        $targetDir = self::$uploadDir;
        if ($subDir) {
            $targetDir .= rtrim($subDir, '/') . '/';
        }

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Generate unique filename
        $filename = uniqid('IMG_') . '_' . date('Ymdhis') . '.' . $extension;
        $targetPath = $targetDir . $filename;

        // Pindahkan file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => 'Gagal menyimpan file.'
            ];
        }

        // Return relative path untuk disimpan di database
        $relativePath = 'uploads/';
        if ($subDir) {
            $relativePath .= rtrim($subDir, '/') . '/';
        }
        $relativePath .= $filename;

        return [
            'success' => true,
            'fileName' => $filename,
            'path'    => $relativePath,
            'error'   => null
        ];
    }

    /**
     * Hapus file dari server
     *
     * @param string|null $path Relative path file
     * @return bool
     */
    public static function deleteFile(?string $path): bool
    {
        if (empty($path)) {
            return true;
        }

        $fullPath = __DIR__ . '/../../public/' . $path;
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return true;
    }
}
