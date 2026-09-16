<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenggunaModel extends Model
{
    protected $table = 'pengguna';

    protected $fillable = ['nama', 'email', 'whatsapp', 'password', 'role'];
}
