<?php
/**
 * JWT Configuration
 */

// Secret key untuk signing JWT tokens
// WAJIB dikonfigurasi di .env — tidak ada fallback untuk keamanan
if (empty($_ENV['JWT_SECRET'])) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'JWT_SECRET belum dikonfigurasi di .env']);
    exit;
}
define('JWT_SECRET', $_ENV['JWT_SECRET']);

// Token expiration dalam detik (24 jam)
define('JWT_EXPIRATION', (int)($_ENV['JWT_EXPIRY'] ?? 86400));

// Algorithm
define('JWT_ALGORITHM', 'HS256');

// Issuer
define('JWT_ISSUER', 'spmb-sma-muhammadiyah-sokaraja');
