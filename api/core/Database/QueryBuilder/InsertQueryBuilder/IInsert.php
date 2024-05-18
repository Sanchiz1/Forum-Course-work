<?php

namespace Core\Database\QueryBuilder\InsertQueryBuilder;

interface IInsert
{
    public function columns(string $columns): IValues;
}