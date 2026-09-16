<?php

namespace App\Helpers\RakitValidator;

use Rakit\Validation\Rule;
use Illuminate\Database\Capsule\Manager;

class ExistRule extends Rule {
    protected $message = ":attribute tidak valid atau tidak ditemukan di sistem.";

    protected $fillableParams = ['table', 'column'];

    public function check($value): bool
    {
        $this->requireParameters(['table', 'column']);

        $table  = $this->parameter('table');
        $column = $this->parameter('column');

        return Manager::table($table)->where($column, $value)->exists();
    }
}