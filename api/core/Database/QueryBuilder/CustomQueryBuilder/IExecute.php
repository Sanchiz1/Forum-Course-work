<?php

namespace Core\Database\QueryBuilder\CustomQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value, $type): IExecute;

    function execute(): bool;

    function fetchAll(string $dbModel): array;

    function fetchFirst(string $dbModel);
}