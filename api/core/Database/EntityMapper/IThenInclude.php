<?php

namespace Core\Database\EntityMapper;

interface IThenInclude extends IOrderBy
{
    function include(string $navigation, string $table): IThenInclude;
    function thenInclude(string $navigation, string $table): IThenInclude;

    function thenIncludeAndSelect(string $navigation, string $table): IThenInclude;

    function where(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}