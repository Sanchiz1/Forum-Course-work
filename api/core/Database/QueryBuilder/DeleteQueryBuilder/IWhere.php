<?php

namespace Core\Database\QueryBuilder\DeleteQueryBuilder;

interface IWhere extends IExecute
{
    function and(string $condition): IWhere;

    function or(string $condition): IWhere;
}