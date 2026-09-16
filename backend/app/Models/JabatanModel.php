<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JabatanModel extends Model
{
    protected $table = 'jabatans';

    protected $guarded = ['id'];

    public $timestamps = false;
}
