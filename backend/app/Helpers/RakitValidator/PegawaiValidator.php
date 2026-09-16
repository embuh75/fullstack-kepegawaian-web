<?php

namespace App\Helpers\RakitValidator;

use App\Helpers\RakitValidator\ValidatorFactory;

class PegawaiValidator
{
    public function create(array $data)
    {
        $validator = ValidatorFactory::make();

        // konversi string kosong ke null
        $data = array_map(function ($item) {
            return trim($item) == null ? $item = null : $item;
        }, $data);

        // validasi
        $validation = $validator->make($data, [
            'nama' => 'required|min:5|max:150',
            'nomor_ktp' => 'required|min:16|max:16|unique:pegawais,nomor_ktp',
            'nomor_nbm' => 'nullable|max:20|unique:pegawais,nomor_nbm',
            'tempat_lahir' => 'required|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'status' => 'required|in:Belum_Menikah,Menikah,Duda',
            'alamat_rumah' => 'required|max:150',
            'nomor_telephone' => ['required', 'regex:/^(08|628|\+628)[0-9]{7,11}$/'],
            'alamat_email' => 'nullable|email|max:50|unique:pegawais,alamat_email',
            'pendidikan_terakhir' => 'nullable|max:10',
            'nama_kampus' => 'nullable|max:50',
            'jurusan' => 'nullable|max:50',
            'tahun_lulus' => 'nullable|numeric|min:1970|max:' . date('Y'),
            'jabatan' => 'required|numeric|exist:jabatans,id',
            'mapel' => 'nullable|numeric|exist:mata_pelajarans,id',
            'nomor_bpjs' => 'nullable|max:50|unique:pegawais,nomor_bpjs',
            'kontak_darurat' => ['nullable', 'regex:/^(08|628|\+628)[0-9]{7,11}$/']
        ]);
        $validation->validate();

        return $validation;
    }

    public function update(array $data, int $id)
    {
        $validator = ValidatorFactory::make();

        // konversi string kosong ke null
        $data = array_map(function ($item) {
            return trim($item) == null ? $item = null : $item;
        }, $data);

        // rules
        $rules = [];
        if (array_key_exists('nama', $data)) {
            $rules['nama'] = 'required|min:5|max:150';
        }
        if (array_key_exists('nomor_ktp', $data)) {
            $rules['nomor_ktp'] = 'required|min:16|max:16|unique:pegawais,nomor_ktp,' . $id;
        }
        if (array_key_exists('nomor_nbm', $data)) {
            $rules['nomor_nbm'] = 'nullable|max:20|unique:pegawais,nomor_nbm,'  . $id;
        }
        if (array_key_exists('tempat_lahir', $data)) {
            $rules['tempat_lahir'] = 'required|max:100';
        }
        if (array_key_exists('tanggal_lahir', $data)) {
            $rules['tanggal_lahir'] = 'required|date:Y-m-d';
        }
        if (array_key_exists('jenis_kelamin', $data)) {
            $rules['jenis_kelamin'] = 'required|in:L,P';
        }
        if (array_key_exists('status', $data)) {
            $rules['status'] = 'required|in:Belum_Menikah,Menikah,Duda';
        }
        if (array_key_exists('alamat_rumah', $data)) {
            $rules['alamat_rumah'] = 'required|max:150';
        }
        if (array_key_exists('nomor_telephone', $data)) {
            $rules['nomor_telephone'] = ['required', 'regex:/^(08|628|\+628)[0-9]{7,11}$/'];
        }
        if (array_key_exists('alamat_email', $data)) {
            $rules['alamat_email'] = 'nullable|email|max:50|unique:pegawais,alamat_email,'  . $id;
        }
        if (array_key_exists('pendidikan_terakhir', $data)) {
            $rules['pendidikan_terakhir'] = 'nullable|max:10';
        }
        if (array_key_exists('nama_kampus', $data)) {
            $rules['nama_kampus'] = 'nullable|max:50';
        }
        if (array_key_exists('jurusan', $data)) {
            $rules['jurusan'] = 'nullable|max:50';
        }
        if (array_key_exists('tahun_lulus', $data)) {
            $rules['tahun_lulus'] = 'nullable|numeric|min:1970|max:' . date('Y');
        }
        if (array_key_exists('jabatan', $data)) {
            $rules['jabatan'] = 'required|numeric|exist:jabatans,id';
        }
        if (array_key_exists('mapel', $data)) {
            $rules['mapel'] = 'nullable|numeric|exist:mata_pelajarans,id';
        }
        if (array_key_exists('nomor_bpjs', $data)) {
            $rules['nomor_bpjs'] = 'nullable|max:50|unique:pegawais,nomor_bpjs,'  . $id;
        }
        if (array_key_exists('kontak_darurat', $data)) {
            $rules['kontak_darurat'] = ['nullable', 'regex:/^(08|628|\+628)[0-9]{7,11}$/'];
        }

        // validator
        $validation = $validator->make($data, $rules);
        $validation->validate();

        return $validation;
    }
}
