<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IWhere extends IOrderBy
{
    function and(string $condition): IWhere;

    function or(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}