<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IExecute
{
    function setParameter(string $parameter, $value): IExecute;

    function execute(): array;

    function getQuery(): string;
}