<?php

namespace Core\Database\EntityMapper;

interface IWhere extends IOrderBy
{
    function and(string $condition, $value): IWhere;

    function or(string $condition, $value): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}