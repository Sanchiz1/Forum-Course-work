<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value, $type): IExecute;

    function execute(): array;

    function getQuery(): string;
}