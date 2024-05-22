<?php

namespace Core\Database\EntityMapper;

interface IOrderBy extends IExecute
{
    function limit(int $limit, int $offset = 0): IExecute;
}