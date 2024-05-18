<?php

namespace Core\Database;

use app\core\Application;
use app\Core\Model;

abstract class DbModel extends \Core\Database\Model
{
    public function primaryKey(): string
    {
        return 'Id';
    }
}