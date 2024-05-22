<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface IOrderBy extends IExecute
{
    function limit(int $limit, int $offset = 0): IExecute;
}