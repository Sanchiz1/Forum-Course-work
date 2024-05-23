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

    public function columns(): array
    {
        return array_merge([$this->primaryKey()], $this->attributes());
    }

    public function selectColumns(): array
    {
        return array_merge([$this->primaryKey()], $this->selectAttributes());
    }
}