<?php

namespace App\Helpers\RakitValidator;

use Rakit\Validation\Validator;

class ValidatorFactory
{
    public static function make(): Validator
    {
        $validator = new Validator();

        $validator->setMessages([
            'required' => ':attribute wajib diisi.',
            'email' => ':attribute harus berupa alamat email yang valid.',
            'numeric' => ':attribute harus berupa angka.',
            'integer' => ':attribute harus berupa bilangan bulat.',
            'array' => ':attribute harus berupa array.',

            'min' => ':attribute minimal :min.',
            'max' => ':attribute maksimal :max.',
            'between' => ':attribute harus berada di antara :min dan :max.',

            'in' => ':attribute harus salah satu dari :allowed_values.',
            'not_in' => ':attribute tidak boleh salah satu dari :disallowed_values.',

            'same' => ':attribute harus sama dengan :same.',
            'different' => ':attribute harus berbeda dengan :different.',

            'date' => ':attribute harus berupa tanggal yang valid.',
            'regex' => 'Format :attribute tidak valid.',

            'url' => ':attribute harus berupa URL yang valid.',
            'boolean' => ':attribute harus berupa nilai boolean.',

            'alpha' => ':attribute hanya boleh berisi huruf.',
            'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
            'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
            'alpha_spaces' => ':attribute hanya boleh berisi huruf dan spasi.',

            'uploaded_file' => ':attribute gagal diunggah atau file tidak valid.',
            'mimes' => ':attribute harus berupa file dengan tipe :allowed_types.',
        ]);

        $validator->setTranslations([
            'and' => 'dan',
            'or' => 'atau',
        ]);

        $validator->addValidator(
            'unique',
            new UniqueRule()
        );

        $validator->addValidator(
            'exist',
            new ExistRule()
        );

        return $validator;
    }
}
