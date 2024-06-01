<?php

namespace Core\Database\QueryBuilder\UpdateQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value, $type): IExecute;

    function execute(): bool;
}