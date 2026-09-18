<?php
// Auth
$router->post('/api/v1/auth/login', 'App\Controllers\AuthController', 'login');
$router->get('/api/v1/auth/me', 'App\Controllers\AuthController', 'me');

// User
$router->post('/api/v1/user/register', 'App\Controllers\UserController', 'register');
$router->get('/api/v1/user', 'App\Controllers\UserController', 'index');
$router->get('/api/v1/user/{id}', 'App\Controllers\UserController', 'find');
$router->patch('/api/v1/user/{id}', 'App\Controllers\UserController', 'update');
$router->delete('/api/v1/user/delete/{id}', 'App\Controllers\UserController', 'delete');

// Jabatan
$router->post('api/v1/jabatan', 'App\Controllers\JabatanController', 'store');
$router->get('api/v1/jabatan', 'App\Controllers\JabatanController', 'index');
$router->get('api/v1/jabatan/{id}', 'App\Controllers\JabatanController', 'find');
$router->patch('api/v1/jabatan/{id}', 'App\Controllers\JabatanController', 'update');
$router->delete('api/v1/jabatan/{id}', 'App\Controllers\JabatanController', 'delete');

// Mapel
$router->post('api/v1/mapel', 'App\Controllers\MapelController', 'store');
$router->get('api/v1/mapel', 'App\Controllers\MapelController', 'index');
$router->get('api/v1/mapel/{id}', 'App\Controllers\MapelController', 'find');
$router->patch('api/v1/mapel/{id}', 'App\Controllers\MapelController', 'update');
$router->delete('api/v1/mapel/{id}', 'App\Controllers\MapelController', 'delete');

// Pegawai
$router->post('api/v1/pegawai', 'App\Controllers\PegawaiController', 'store');
$router->get('api/v1/pegawai', 'App\Controllers\PegawaiController', 'index');
$router->get('api/v1/pegawai/{id}', 'App\Controllers\PegawaiController', 'find');
$router->patch('api/v1/pegawai/{id}', 'App\Controllers\PegawaiController', 'update');
$router->delete('api/v1/pegawai/{id}', 'App\Controllers\PegawaiController', 'delete');

// Root
$router->get('api/v1', 'App\Controllers\MainController', 'root');