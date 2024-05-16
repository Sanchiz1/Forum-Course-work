<?php

namespace Core\Http;

class Response
{
    public mixed $data;

    public  function __construct(mixed $data)
    {
        $this->data = $data;
    }
}