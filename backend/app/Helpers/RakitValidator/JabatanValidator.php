<?php

namespace App\Helpers\RakitValidator;

use App\Helpers\RakitValidator\ValidatorFactory;

class JabatanValidator
{
    public function create(array $data)
    {
        $validator = ValidatorFactory::make();

        $validation = $validator->make($data, [
            'nama' => 'required|min:5|max:50',
            'kode' => 'required|min:1|max:5|unique:jabatans,kode'
        ]);
        $validation->validate();

        return $validation;
    }

    public function update(array $data, int $id)
    {
        $validator = ValidatorFactory::make();

        $rules = [];
        if (array_key_exists('nama', $data)) {
            $rules['nama'] = 'required|min:5|max:50';
        }
        if (array_key_exists('kode', $data)) {
            $rules['kode'] = 'required|min:1|max:5|unique:jabatans,kode,' . $id;
        }

        $validation = $validator->make($data, $rules);
        $validation->validate();

        return $validation;
    }
}
