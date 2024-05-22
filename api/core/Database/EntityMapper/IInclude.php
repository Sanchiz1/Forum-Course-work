<?php

namespace Core\Database\EntityMapper;

interface IInclude extends IOrderBy
{
    function include(string $navigation, string $table): IThenInclude;

    function includeAndSelect(string $navigation, string $table): IThenInclude;

    function where(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}