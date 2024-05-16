<?php

namespace Core\Http;

class RequestParser
{
    public static function getRequest() : Request
    {
        $url = self::getPath();
        $method = self::getMethod();
        $headers = getallheaders();

        $body = $headers["Content-Type"] == "application/json" ?
            self::getJsonBody() : null;

        return new Request($url, $method, $body, $headers);
    }

    private static function getMethod()
    {
        return strtolower($_SERVER['REQUEST_METHOD']);
    }

    private static function getPath() : string
    {
        $path = $_SERVER['REQUEST_URI'];
        $position = strpos($path, '?');
        if ($position !== false) {
            $path = substr($path, 0, $position);
        }
        return $path;
    }

    private static function getJsonBody() : mixed
    {
        return json_decode(file_get_contents('php://input'), true);
    }
}