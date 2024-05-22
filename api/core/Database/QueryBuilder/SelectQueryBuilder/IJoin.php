<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IJoin extends IOrderBy
{
    function addSelect(string $select) : IJoin;

    function join(string $type, string $table, string $alias, string $condition) : IJoin;

    function where(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}