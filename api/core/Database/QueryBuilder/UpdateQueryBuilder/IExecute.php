<?php

namespace Core\Database\QueryBuilder\UpdateQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value): IExecute;

    function execute(): bool;
}