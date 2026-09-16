<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MapelModel;
use App\Models\JabatanModel;

class PegawaiModel extends Model {
    protected $table = 'pegawais';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function mapel() {
        return $this->belongsTo(MapelModel::class, 'mapel');
    }

    public function jabatan() {
        return $this->belongsTo(JabatanModel::class, 'jabatan');
    }
}