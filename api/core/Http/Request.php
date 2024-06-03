<?php

namespace Core\Http;

class Request
{
    private string $uri;
    private string $method;
    private mixed $body;
    private array $routeParams;
    private array $queryParams;
    private array $headers;
    private array $files;

    /**
     * @param string $uri
     * @param string $method
     * @param mixed $body
     * @param array $headers
     * @param array $queryParams
     */
    public function __construct(string $uri, string $method, mixed $body, array $headers, array $queryParams, array $files)
    {
        $this->uri = $uri;
        $this->method = $method;
        $this->body = $body;
        $this->headers = $headers;
        $this->queryParams = $queryParams;
        $this->files = $files;
    }

    public function getUri() : string
    {
        return $this->uri;
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

    public function getQueryParams() : array
    {
        return $this->queryParams;
    }


    public function getQueryParam($param, $default = null)
    {
        return $this->queryParams[$param] ?? $default;
    }

    public function getRouteParams() : array
    {
        return $this->routeParams;
    }

    public function getRouteParam($param, $default = null)
    {
        return $this->routeParams[$param] ?? $default;
    }

    public function setRouteParams($params) : void
    {
        $this->routeParams = $params;
    }

    public function getFiles()
    {
        return $this->files;
    }
}