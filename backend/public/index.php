<?php

/**
 * Entry Point - SPMB SMA Muhammadiyah Sokaraja
 * Production Ready Version
 */

// Define Base Path
define('BASE_PATH', dirname(__DIR__));

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Load env PERTAMA sebelum apapun
require_once BASE_PATH . '/config/env.php';

// Error reporting — otomatis berdasarkan APP_ENV
if (true) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}

// Load konfigurasi dasar dulu
require_once BASE_PATH . '/config/database.php';
require_once BASE_PATH . '/config/jwt.php';
require_once BASE_PATH . '/config/cors.php';

// Set timezone
date_default_timezone_set('Asia/Jakarta');

// Autoload Composer
$autoloadPath = BASE_PATH . '/vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Composer autoload tidak ditemukan. Jalankan "composer install".'
    ]);
    exit;
}

// Global Exception Handler
set_exception_handler(function (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    $response = [
        'success' => false,
        'message' => 'Terjadi kesalahan internal server.',
    ];
    // Hanya tampilkan detail error di development
    if (true) {
        $response['error'] = $e->getMessage();
        $response['trace'] = $e->getTraceAsString();
    }
    echo json_encode($response);
    error_log('Uncaught Exception: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    exit;
});

// Load Router
$router = new \App\Core\Router();

// Load Routes
require_once BASE_PATH . '/routes/api.php';

// Parse URI
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Handle subfolder deployment (contoh: localhost/SPMB_SMA/SPMB_SMA_backend)
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && $scriptName !== '\\') {
    // Jika diakses melalui subfolder (termasuk /public), base path adalah scriptName itu sendiri
    $appBasePath = $scriptName; 
    $basePath = str_replace('\\', '/', $appBasePath);
    
    // Jika masih ada '/' di akhir, hapus
    $basePath = rtrim($basePath, '/');

    if ($basePath !== '' && strpos($requestUri, $basePath) === 0) {
        $requestUri = substr($requestUri, strlen($basePath));
    }
}

// Remove query string
if (($pos = strpos($requestUri, '?')) !== false) {
    $requestUri = substr($requestUri, 0, $pos);
}

// Pastikan diawali dengan '/'
if (empty($requestUri) || $requestUri[0] !== '/') {
    $requestUri = '/' . $requestUri;
}

// Dispatch
$router->dispatch($requestMethod, $requestUri);