<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IGroupBy extends IOrderBy
{
    function having(string $condition): IHaving;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}