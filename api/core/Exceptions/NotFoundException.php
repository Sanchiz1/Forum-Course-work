<?php

namespace Core\Exceptions;

class NotFoundException extends \Exception
{
    protected $message;
    protected $code = 404;
    public function __construct($message)
    {
        $this->message = $message;
    }
}