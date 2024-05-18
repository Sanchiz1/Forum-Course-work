<?php

namespace Core\Database\QueryBuilder\UpdateQueryBuilder;

interface ISet extends IExecute
{
    function set(string $key, $value): ISet;

    function where(string $condition): IWhere;
}