<?php

namespace Core\Controller;

use core\Http\Request;

abstract class Controller
{
    protected function json($data)
    {
        header('Content-Type: application/json; charset=utf-8');
        return json_encode($data);
    }

    protected function ok($data = null) : void
    {
        http_response_code(200);
        exit($data);
    }

    protected function unathorized($data = null) : void
    {
        http_response_code(401);
        exit($data);
    }

    protected function badRequest($data = null) : void
    {
        http_response_code(400);
        exit($data);
    }


    public function getAuthorizationHeader(Request $request): string
    {
        $auth = $request->getHeaders()["Authorization"];

        if ($auth == null) {
            $this->Unathorized();
        }

        return substr($auth, 7);
    }
}