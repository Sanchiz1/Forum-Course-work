<?php

namespace Core\Database\QueryBuilder\CustomQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value): IExecute;

    function execute(): bool;
    function fetchAll(): array;
}