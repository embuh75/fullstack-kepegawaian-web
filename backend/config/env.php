<?php

function loadEnv($path) {
  if (!file_exists($path)) {
    return;
  }
  
  $lines = file($path, 
    FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
  );
  
  foreach ($lines as $line) {
    // Skip komentar
    if (strpos(trim($line), '#') === 0) {
      continue;
    }
    
    // Parse KEY=VALUE
    if (strpos($line, '=') !== false) {
      list($key, $value) = explode('=', $line, 2);
      $key = trim($key);
      $value = trim($value);
      
      // Hapus quote jika ada
      $value = trim($value, '"\'');
      
      if (!empty($key)) {
        $_ENV[$key] = $value;
        putenv("{$key}={$value}");
      }
    }
  }
}

// Load .env saat file ini di-include
loadEnv(dirname(__DIR__) . '/.env');
