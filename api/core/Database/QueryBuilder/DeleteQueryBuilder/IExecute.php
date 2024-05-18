<?php

namespace Core\Database\QueryBuilder\DeleteQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value): IExecute;

    function execute(): bool;
}