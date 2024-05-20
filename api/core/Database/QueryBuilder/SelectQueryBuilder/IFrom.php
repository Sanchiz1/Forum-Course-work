<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IFrom
{
    public function from(string $table, string $alias = null) : IJoin;
}