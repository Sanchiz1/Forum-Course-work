<?php

namespace Core\Database\EntityMapper;

interface ITake extends IExecute
{
    function skip(int $skip): IExecute;
}