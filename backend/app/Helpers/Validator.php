<?php

/**
 * Validator Helper
 * Validasi input data request
 */

namespace App\Helpers;

class Validator
{
    private array $errors = [];
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Validasi field required
     */
    public function required(string $field, string $label = ''): self
    {
        $label = $label ?: $field;
        if (!isset($this->data[$field]) || trim((string) $this->data[$field]) === '') {
            $this->errors[$field] = "{$label} wajib diisi.";
        }
        return $this;
    }

    /**
     * Validasi format email
     */
    public function email(string $field, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
                $this->errors[$field] = "Format {$label} tidak valid.";
            }
        }
        return $this;
    }

    /**
     * Validasi minimum panjang string
     */
    public function minLength(string $field, int $min, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && strlen((string) $this->data[$field]) < $min) {
            $this->errors[$field] = "{$label} minimal {$min} karakter.";
        }
        return $this;
    }

    /**
     * Validasi maksimum panjang string
     */
    public function maxLength(string $field, int $max, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && strlen((string) $this->data[$field]) > $max) {
            $this->errors[$field] = "{$label} maksimal {$max} karakter.";
        }
        return $this;
    }

    /**
     * Validasi numeric
     */
    public function numeric(string $field, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!is_numeric($this->data[$field])) {
                $this->errors[$field] = "{$label} harus berupa angka.";
            }
        }
        return $this;
    }

    /**
     * Validasi panjang digit tepat
     */
    public function exactLength(string $field, int $length, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (strlen((string) $this->data[$field]) !== $length) {
                $this->errors[$field] = "{$label} harus {$length} digit.";
            }
        }
        return $this;
    }

    /**
     * Validasi nilai harus termasuk dalam daftar enum
     */
    public function enum(string $field, array $values, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!in_array($this->data[$field], $values, true)) {
                $allowed = implode(', ', $values);
                $this->errors[$field] = "{$label} harus salah satu dari: {$allowed}.";
            }
        }
        return $this;
    }

    /**
     * Validasi unique di database
     */
    public function unique(string $field, string $table, string $column, string $label = '', ?int $exceptId = null): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            $db = getDB();
            $sql = "SELECT COUNT(*) FROM `{$table}` WHERE `{$column}` = ?";
            $params = [$this->data[$field]];

            if ($exceptId !== null) {
                $sql .= " AND `id` != ?";
                $params[] = $exceptId;
            }

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            if ($stmt->fetchColumn() > 0) {
                $this->errors[$field] = "{$label} sudah terdaftar.";
            }
        }
        return $this;
    }

    /**
     * Validasi array (minimal 1 elemen)
     */
    public function arrayMinCount(string $field, int $min = 1, string $label = ''): self
    {
        $label = $label ?: $field;
        if (isset($this->data[$field])) {
            $value = $this->data[$field];
            if (is_string($value)) {
                $value = json_decode($value, true);
            }
            if (!is_array($value) || count($value) < $min) {
                $this->errors[$field] = "{$label} minimal {$min} pilihan.";
            }
        }
        return $this;
    }

    /**
     * Cek apakah validasi gagal
     */
    public function fails(): bool
    {
        return !empty($this->errors);
    }

    /**
     * Ambil semua error
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Get validated data
     */
    public function getData(): array
    {
        return $this->data;
    }
}