<?php

namespace App\Helpers;

class Response
{
    public static function success($data = null, string $message = 'Berhasil.', int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    public static function error(string $message = 'Terjadi kesalahan.', $errors = null, int $code = 400): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors'  => $errors
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}
