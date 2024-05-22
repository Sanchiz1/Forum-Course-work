<?php

namespace Core\Database\EntityMapper;

interface IWhere extends IOrderBy
{
    function and(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere;

    function or(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}