<?php

namespace Core\Database\QueryBuilder\CustomQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value, $type): IExecute;

    function execute(): bool;

    function fetchAll(string $dbModel): array;

    function fetchColumn($column = 0): array;

    function fetchFirst(string $dbModel);

    public function fetchScalar();
}