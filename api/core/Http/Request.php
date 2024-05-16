<?php

namespace Core\Http;

class Request
{
    private string $url;
    private string $method;
    private mixed $body;
    private array $routeParams;
    private array $headers;

    /**
     * @param string $url
     * @param string $method
     * @param mixed $body
     * @param array $routeParams
     * @param array $headers
     */
    public function __construct(string $url, string $method, mixed $body, array $headers)
    {
        $this->url = $url;
        $this->method = $method;
        $this->body = $body;
        $this->headers = $headers;
    }

    public function getUrl() : string
    {
        return $this->url;
    }

    public function getMethod() : string
    {
        return $this->method;
    }

    public function getHeaders() : array
    {
        return $this->headers;
    }
    public function getBody() : mixed
    {
        return $this->body;
    }

    public function setRouteParams($params) : void
    {
        $this->routeParams = $params;
    }

    public function getRouteParams() : array
    {
        return $this->routeParams;
    }

    public function getRouteParam($param, $default = null)
    {
        return $this->routeParams[$param] ?? $default;
    }
}