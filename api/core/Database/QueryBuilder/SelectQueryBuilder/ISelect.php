<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface ISelect extends IOrderBy
{
    function where(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}