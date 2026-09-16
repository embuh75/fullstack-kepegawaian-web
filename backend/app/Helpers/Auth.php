<?php

namespace App\Helpers;

class Auth
{
    private static ?array $user = null;

    /**
     * Set the current authenticated user (usually called by AuthMiddleware)
     */
    public static function setUser(array $userData): void
    {
        self::$user = $userData;
    }

    /**
     * Get the current authenticated user ID
     */
    public static function id(): ?int
    {
        return self::$user['id'] ?? null;
    }

    /**
     * Get the current authenticated user data
     */
    public static function user(): ?array
    {
        return self::$user;
    }

    /**
     * Check if user is admin
     */
    public static function isAdmin(): bool
    {
        return (self::$user['role'] ?? '') === 'admin';
    }
}
