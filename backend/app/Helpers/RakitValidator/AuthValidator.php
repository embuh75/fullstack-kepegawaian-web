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
            'email' => 'required|email|min:5|max:50',
            'whatsapp' => ['required', 'regex:/^(08|628|\+628)[0-9]{7,11}$/'],
            'password' => 'required|alpha_num|min:8|max:24',
            'confirm_password' => 'required|same:password',
            'role' => 'required|in:admin,user'
        ]);
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
