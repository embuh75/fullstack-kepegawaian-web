<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PegawaiModel;

class MapelModel extends Model
{
    protected $table = 'mata_pelajarans';

    protected $guarded = ['id'];

    public $timestamps = false;
}
