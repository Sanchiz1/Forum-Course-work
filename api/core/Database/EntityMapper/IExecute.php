<?php

namespace Core\Database\EntityMapper;

interface IExecute
{
    function execute(): array;
    function getQuery(): string;
}