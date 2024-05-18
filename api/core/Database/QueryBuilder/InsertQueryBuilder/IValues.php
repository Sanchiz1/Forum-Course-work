<?php

namespace Core\Database\QueryBuilder\InsertQueryBuilder;

interface IValues
{
    public function values(string $values): IExecute;
}