<?php

namespace Core\Database\QueryBuilder\CustomQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value, $type): IExecute;

    function execute(): bool;
    function fetchAll(): array;
}