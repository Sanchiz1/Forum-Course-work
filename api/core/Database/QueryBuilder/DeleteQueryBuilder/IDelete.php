<?php

namespace Core\Database\QueryBuilder\DeleteQueryBuilder;

interface IDelete extends IExecute
{
    function where(string $condition): IWhere;
}