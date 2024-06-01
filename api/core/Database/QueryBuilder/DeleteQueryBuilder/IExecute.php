<?php

namespace Core\Database\QueryBuilder\DeleteQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value, $type): IExecute;

    function execute(): bool;
}