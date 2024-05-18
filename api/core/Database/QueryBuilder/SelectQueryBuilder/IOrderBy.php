<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IOrderBy extends ILimit
{
    function limit(int $limit): ILimit;
}