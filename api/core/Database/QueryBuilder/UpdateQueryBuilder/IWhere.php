<?php

namespace Core\Database\QueryBuilder\UpdateQueryBuilder;

interface IWhere extends IExecute
{
    function and(string $condition): IWhere;

    function or(string $condition): IWhere;
}