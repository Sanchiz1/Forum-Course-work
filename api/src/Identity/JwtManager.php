<?php

namespace App\Identity;

use Core\Application;
use Core\Auth\Jwt\IJwtManager;
use Core\Http\Response;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtManager implements IJwtManager
{
    private static function tokenSecret(): string
    {
        return 'my_strong_token_secret';
    }

    public function encodeToken($data): mixed
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + 5184000;

        $tokenSecret = static::tokenSecret();
        $content = array(
            'iss' => 'http://localhost:8000',
            'iat' => $issuedAt,
            'exp' => $expiresAt
        );

        $content = array_merge($content, $data);
        $token = JWT::encode($content, $tokenSecret, 'HS256');

        return ["token" => $token,
            "expires" => $expiresAt,
            "issued" => $issuedAt];
    }

    /**
     * @throws Exception
     */
    public function decodeToken($token): array
    {
        $tokenSecret = static::tokenSecret();
        try {
            return (array)JWT::decode($token, new Key($tokenSecret, 'HS256'));
        } catch (Exception $e) {
            $response = new Response(401, null, "Invalid token");
            $response->AddHeader('Content-Type: application/json; charset=utf-8');
            Application::$app->exit($response);
            throw new Exception("Application failed to exit");
        }
    }
}