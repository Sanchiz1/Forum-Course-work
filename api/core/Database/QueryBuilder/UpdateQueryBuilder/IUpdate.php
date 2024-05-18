<?php

namespace Core\Database\QueryBuilder\UpdateQueryBuilder;

interface IUpdate
{
    function set(string $key, $value): ISet;
}