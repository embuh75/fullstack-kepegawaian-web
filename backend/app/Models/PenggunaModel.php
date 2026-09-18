<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenggunaModel extends Model
{
    protected $table = 'pengguna';

    protected $fillable = ['nama', 'foto', 'email', 'whatsapp', 'password', 'role'];
}
