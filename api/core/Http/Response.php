<?php

namespace Core\Http;

class Response
{
    public mixed $data;
    public string $error;
    public int $statusCode;
    public array $headers = array();

    public  function __construct(int $statusCode, mixed $data, string $error = "")
    {
        $this->statusCode = $statusCode;
        $this->data = $data;
        $this->error = $error;
    }

    public function AddHeader(string $header)
    {
        $this->headers[] = $header;
    }
}