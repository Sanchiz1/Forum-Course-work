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

    public function encodeToken($data): string
    {
        $tokenSecret = static::tokenSecret();
        $token = array(
            'iss' => 'http://localhost:8000',
            'iat' => time(),
            'exp' => time() + 5184000
        );

        $token = array_merge($token, $data);
        return JWT::encode($token, $tokenSecret, 'HS256');
    }

    /**
     * @throws Exception
     */
    public function decodeToken($token) : array
    {
        $tokenSecret = static::tokenSecret();
        try
        {
            return (array) JWT::decode($token, new Key($tokenSecret, 'HS256'));
        }
        catch (Exception $e)
        {
            $response = new Response(401, null, "Invalid token");
            $response->AddHeader('Content-Type: application/json; charset=utf-8');
            Application::$app->exit($response);
            throw new Exception("Application failed to exit");
        }
    }
}