<?php

namespace Core\Controller;

use core\Http\Request;
use Core\Http\Response;

abstract class Controller
{
    protected function json(Response $response) : Response
    {
        $response->AddHeader('Content-Type: application/json; charset=utf-8');

        return $response;
    }

    protected function ok($data = null) : Response
    {
        return new Response(200, $data);
    }

    protected function unathorized(string $error = "") : Response
    {
        return new Response(401, null, $error);
    }

    protected function badRequest(string $error = "") : Response
    {
        return new Response(400, null, $error);
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