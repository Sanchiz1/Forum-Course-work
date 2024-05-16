<?php

namespace Core\Database;

use app\core\Application;
use app\Core\Model;

abstract class DbModel extends Model
{
    public static function primaryKey(): string
    {
        return 'Id';
    }

    public static function prepare($sql): \PDOStatement
    {
        return Application::$app->db->prepare($sql);
    }
}