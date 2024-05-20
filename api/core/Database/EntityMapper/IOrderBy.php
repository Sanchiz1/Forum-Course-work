<?php

namespace Core\Database\EntityMapper;

interface IOrderBy extends ITake
{
    function limit(int $limit): ITake;
}