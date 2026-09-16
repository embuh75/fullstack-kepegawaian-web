<?php
/**
 * Auth Middleware
 * Validasi JWT token dari header Authorization
 */

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use App\Helpers\Response;

class AuthMiddleware
{
    /**
     * Validasi token dan return user data
     *
     * @return object User data dari JWT payload (id, email, role)
     */
    public static function authenticate(): object
    {
        // Ambil header Authorization
        $authHeader = self::getAuthorizationHeader();

        if (!$authHeader) {
            Response::error('Token tidak ditemukan. Silakan login terlebih dahulu.', null, 401);
        }

        // Extract token dari "Bearer <token>"
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::error('Format token tidak valid.', null, 401);
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGORITHM));
            \App\Helpers\Auth::setUser((array)$decoded->data);
            return $decoded->data;
        } catch (ExpiredException $e) {
            Response::error('Token sudah expired. Silakan login kembali.', null, 401);
        } catch (\Exception $e) {
            Response::error('Token tidak valid.', null, 401);
        }

        // Ini tidak akan pernah tercapai karena Response::error() memanggil exit
        exit;
    }

    /**
     * Ambil Authorization header
     */
    private static function getAuthorizationHeader(): ?string
    {
        // Method 1: getallheaders()
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            foreach ($headers as $key => $value) {
                if (strtolower($key) === 'authorization') {
                    return $value;
                }
            }
        }

        // Method 2: $_SERVER
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return $_SERVER['HTTP_AUTHORIZATION'];
        }

        // Method 3: Apache redirect
        if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        return null;
    }

    /**
     * Generate JWT token
     *
     * @param array $userData Data user (id, email, role)
     * @return string JWT token
     */
    public static function generateToken(array $userData): string
    {
        $issuedAt = time();
        $expiration = $issuedAt + JWT_EXPIRATION;

        $payload = [
            'iss'  => JWT_ISSUER,
            'iat'  => $issuedAt,
            'exp'  => $expiration,
            'data' => [
                'id'    => $userData['id'],
                'email' => $userData['email'],
                'role'  => $userData['role']
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);
    }
}
