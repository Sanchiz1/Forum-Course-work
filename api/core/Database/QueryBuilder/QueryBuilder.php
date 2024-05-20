<?php

namespace Core\Database\QueryBuilder;

use Core\Database\QueryBuilder\DeleteQueryBuilder\DeleteQueryBuilder;
use Core\Database\QueryBuilder\DeleteQueryBuilder\IDelete;
use Core\Database\QueryBuilder\InsertQueryBuilder\IInsert;
use Core\Database\QueryBuilder\InsertQueryBuilder\InsertQueryBuilder;
use Core\Database\EntityMapper\ISelect;
use Core\Database\EntityMapper\SelectQueryBuilder;
use Core\Database\QueryBuilder\UpdateQueryBuilder\IUpdate;
use Core\Database\QueryBuilder\UpdateQueryBuilder\UpdateQueryBuilder;

class QueryBuilder
{
    public function create(string $tableName) : IInsert
    {
        return new InsertQueryBuilder($tableName);
    }

    public function read() : ISelect
    {
        return new SelectQueryBuilder();
    }

    public function update(string $tableName) : IUpdate
    {
        return new UpdateQueryBuilder($tableName);
    }

    public function delete(string $tableName) : IDelete
    {
        return new DeleteQueryBuilder($tableName);
    }
}