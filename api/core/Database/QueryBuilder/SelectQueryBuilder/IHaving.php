<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IHaving extends IOrderBy
{
    function andHaving(string $condition): IHaving;

    function orHaving(string $condition): IHaving;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}