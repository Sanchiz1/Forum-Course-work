<?php

namespace Core\Database;

use app\core\Application;
use app\Core\Model;

abstract class DbModel
{
    public static function primaryKey(): string
    {
        return 'Id';
    }
}