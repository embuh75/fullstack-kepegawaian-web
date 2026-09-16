<?php

function setCorsHeaders() {
  $allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
  ];

  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

  // Jika ada Origin header (request dari browser)
  if (!empty($origin)) {
    if (in_array($origin, $allowedOrigins)) {
      // Origin diizinkan
      header(
        "Access-Control-Allow-Origin: {$origin}"
      );
      header(
        "Access-Control-Allow-Credentials: true"
      );
    } else {
      // Origin TIDAK diizinkan
      // Blok untuk SEMUA method, bukan hanya OPTIONS
      http_response_code(403);
      header('Content-Type: application/json');
      echo json_encode([
        'success' => false,
        'message' => 'Origin tidak diizinkan',
        'data' => null
      ]);
      exit; // WAJIB ada exit agar controller tidak ikut dijalankan
    }
  }
  // Jika tidak ada Origin header (curl tanpa -H Origin, Postman, server-to-server) → izinkan
  // Ini normal dan aman untuk development

  header(
    "Access-Control-Allow-Methods: " .
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  header(
    "Access-Control-Allow-Headers: " .
    "Content-Type, Authorization, X-Requested-With"
  );
  header("Access-Control-Max-Age: 86400");

  // Handle preflight OPTIONS
  if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
  }
}

setCorsHeaders();
