<?php

namespace App\Helpers\RakitValidator;

use App\Helpers\RakitValidator\ValidatorFactory;

class AuthValidator
{
    public function register(array $data)
    {
        $validator = ValidatorFactory::make();

        $validation = $validator->make($data, [
            'nama' => 'required|max:50',
            'email' => 'required|email|min:5|max:50|unique:pengguna,email',
            'whatsapp' => ['required', 'regex:/^(08|628|\+628)[0-9]{7,11}$/', 'unique:pengguna,whatsapp'],
            'password' => 'required|alpha_num|min:8|max:24',
            'confirm_password' => 'required|same:password',
            'role' => 'required|in:admin,user'
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

        $rules = [];
        if (array_key_exists('nama', $data)) {
            $rules['nama'] = 'required|max:150';
        }
        if (array_key_exists('email', $data)) {
            $rules['email'] = 'required|min:5|max:50|unique:pengguna,whatsapp,' . $id;
        }
        if (array_key_exists('whatsapp', $data)) {
            $rules['whatsapp'] = ['required', 'regex:/^(08|628|\+628)[0-9]{7,11}$/', 'unique:pengguna,whatsapp,' . $id];
        }
        if (array_key_exists('password', $data)) {
            $rules['password'] = 'required|min:5|max:150';
        }
        if (array_key_exists('confirm_password', $data)) {
            $rules['confirm_password'] = 'required|min:5|max:150';
        }
        if (array_key_exists('role', $data)) {
            $rules['role'] = 'required|min:5|max:150';
        }

        $validation = $validator->make($data, $rules);
        $validation->validate();

        return $validation;
    }

    public function login(array $data)
    {
        $validator = ValidatorFactory::make();

        $validation = $validator->make($data, [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $validation->validate();

        return $validation;
    }
}
