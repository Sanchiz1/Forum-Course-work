<?php

namespace Core\Auth;

use Core\Http\Request;

interface IAuthManager
{
    function isAuthorized(): bool;
    function authorize(Request $request): void;

    function getUserClaims(): array;

    function getUserClaim(string $name, $default = null): mixed;
}