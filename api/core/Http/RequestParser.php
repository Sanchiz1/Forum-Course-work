<?php

namespace Core\Http;

class RequestParser
{
    public static function getRequest() : Request
    {
        $uri = self::getUri();
        $method = self::getMethod();
        $headers = getallheaders();
        $queryParams = self::getQueryParams();

        $body = $headers["content-type"] == "application/json" ?
            self::getJsonBody() : null;

        return new Request($uri, $method, $body, $headers, $queryParams);
    }

    private static function getMethod()
    {
        return strtolower($_SERVER['REQUEST_METHOD']);
    }

    private static function getUri() : string
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

    private static function getQueryParams() : array
    {
        $queries = array();

        parse_str($_SERVER['QUERY_STRING'], $queries);

        $queries = array_map('strtolower', $queries);
        return array_change_key_case($queries);
    }
}