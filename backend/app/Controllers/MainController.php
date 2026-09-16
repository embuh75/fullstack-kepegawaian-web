<?php

namespace App\Controllers;

use App\Helpers\Response;

class MainController
{
    public function root()
    {
        $data = [
            'status' => 'online',
            'date' => date('Y-m-d h:i:s')
        ];
        Response::success($data, 'REST API KEPEGAWAIAN SMA V1.');
    }
}
