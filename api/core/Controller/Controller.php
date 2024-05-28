<?php

namespace Core\Controller;

use Core\Application;
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

    protected function notFound(string $error = "") : Response
    {
        return new Response(404, null, $error);
    }

    public function User(): array
    {
        return Application::$app->authManager?->getUserClaims();
    }

    public function UserClaim(string $name, $default = null): mixed
    {
        return Application::$app->authManager?->getUserClaim($name, $default);
    }
}