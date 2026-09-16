<?php

namespace App\Config;

use PDO;

/**
 * Database Config Class
 * Wrapper yang mendelegasikan ke getDB() dari config/database.php
 * Memastikan hanya ada SATU koneksi PDO di seluruh aplikasi
 */
class Database
{
    public static function getConnection(): PDO
    {
        return getDB();
    }
}

