<?php

namespace Core\Database;

abstract class Model
{
    public abstract function attributes() : array;
    public function selectAttributes() : array{
        return $this->attributes();
    }
}