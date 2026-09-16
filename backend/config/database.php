<?php

/**
 * Database Configuration
 * Koneksi MySQL menggunakan PDO
 */

define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'db_kepegawaian_sma');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get database connection (singleton pattern)
 * @return PDO
 */
function getDB(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Koneksi database gagal.',
                'errors'  => null
            ]);
            exit;
        }
    }

    return $pdo;
}

/**
 * Database Configuration
 * Koneksi MySQL menggunakan Eloquent ORM
 */

use Illuminate\Database\Capsule\Manager as Capsule;

require_once BASE_PATH . '/vendor/autoload.php';

$capsule = new Capsule;

// Sesuaikan cara baca env dengan sistem di projek kamu (bisa pakai $_ENV atau getenv())
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => $_ENV['DB_HOST'],
    'database'  => $_ENV['DB_NAME'],
    'username'  => $_ENV['DB_USER'],
    'password'  => $_ENV['DB_PASS'],
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

// Buat instance Capsule ini menjadi global agar bisa diakses di mana saja (Controller/Model)
$capsule->setAsGlobal();

// Nyalakan fitur ORM Eloquent
$capsule->bootEloquent();
