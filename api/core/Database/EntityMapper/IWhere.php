<?php

namespace Core\Database\EntityMapper;

interface IWhere extends IOrderBy
{
    function and(string $condition): IWhere;

    function or(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}