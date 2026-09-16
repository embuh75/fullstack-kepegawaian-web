<?php

namespace App\Helpers\RakitValidator;

use Rakit\Validation\Rule;
use Illuminate\Database\Capsule\Manager;

class UniqueRule extends Rule
{
    protected $message = ":attribute :value sudah terdaftar.";

    protected $fillableParams = ['table', 'column', 'except'];

    public function check($value): bool
    {
        $this->requireParameters(['table', 'column']);

        $table  = $this->parameter('table');
        $column = $this->parameter('column');
        $except = $this->parameter('except');

        $query = Manager::table($table)->where($column, $value);

        if ($except) {
            $query->where('id', '!=', $except);
        }

        return ! $query->exists();
    }
}