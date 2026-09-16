<?php

namespace App\Helpers\RakitValidator;

use App\Helpers\RakitValidator\ValidatorFactory;

class MapelValidator
{
    public function create(array $data)
    {
        $validator = ValidatorFactory::make();

        $validation = $validator->make($data, [
            'nama' => 'required|min:5|max:50',
            'kode' => 'required|min:1|max:5|unique:mata_pelajarans,kode'
        ]);
        $validation->validate();

        return $validation;
    }

    public function update(array $data, int $id)
    {
        $validator = ValidatorFactory::make();

        $rules = [];
        if (array_key_exists('nama', $data)) {
            $rules['nama'] = 'min:5|max:50';
        }
        if (array_key_exists('kode', $data)) {
            $rules['kode'] = 'min:1|max:5|unique:mata_pelajarans,kode,' . $id;
        }

        $validation = $validator->make($data, $rules);
        $validation->validate();

        return $validation;
    }
}
