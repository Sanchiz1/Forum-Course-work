<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface ILimit extends IExecute
{
    function offset(int $offset): IExecute;
}