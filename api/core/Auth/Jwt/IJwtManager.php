<?php

namespace Core\Auth\Jwt;

interface IJwtManager
{
    function decodeToken($token) : array;
}