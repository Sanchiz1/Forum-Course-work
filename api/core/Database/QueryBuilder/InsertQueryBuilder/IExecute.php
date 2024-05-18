<?php

namespace Core\Database\QueryBuilder\InsertQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value): IExecute;

    function execute(): string;
}