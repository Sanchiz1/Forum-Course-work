<?php

namespace Core\Database\EntityMapper;

interface IInclude extends IOrderBy
{
    function include(string $navigation, string $table): IThenInclude;

    function includeAndSelect(string $navigation, string $table): IThenInclude;

    function where(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}