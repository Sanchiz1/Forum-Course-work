<?php

namespace Core\Auth\Jwt;

use Core\Application;
use Core\Auth\IAuthManager;
use Core\Http\Request;

class JwtAuthManager implements IAuthManager
{
    private IJwtManager $jwtManager;
    private bool $isAuthorized = false;
    private array | false $claims = array();

    public function __construct(IJwtManager $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    function isAuthorized(): bool
    {
        return $this->isAuthorized;
    }

    function authorize(Request $request): void
    {
        $auth = $request->getHeaders()["authorization"];

        if($auth == null){
            return;
        }

        $token = substr($auth, 7);
        $this->claims = $this->jwtManager->decodeToken($token);
        $this->isAuthorized = true;
    }

    function getUserClaims(): array
    {
        return $this->claims;
    }

    function getUserClaim(string $name, $default = null): mixed
    {
        return $this->claims[$name] ?? $default;
    }
}