<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;

interface ISelect
{
    function select(string ...$select) : IFrom;
}