<?php

namespace Core;

use Core\Auth\IAuthManager;
use Core\Auth\Jwt\IJwtManager;
use Core\Auth\Jwt\JwtAuthManager;
use Core\Controller\Controller;
use Core\Database\Database;
use Core\Http\Cors;
use Core\Http\Request;
use Core\Http\RequestParser;
use Core\Http\Response;
use Core\Http\ResponseHandler;
use Core\Routing\Router;

class Application
{
    public static Application $app;
    public Request $request;
    public Router $router;
    public Database $db;
    public ?IAuthManager $authManager = null;
    public ResponseHandler $responseHandler;

    public function __construct($config)
    {
        self::$app = $this;
        $this->request = RequestParser::getRequest();
        $this->router = new Router($this->request);
        $this->db = new Database($config['db']);
        $this->responseHandler = new ResponseHandler();
    }

    public function addJwtAuth(IJwtManager $jwtManager): void
    {
        $this->authManager = new JwtAuthManager($jwtManager);
    }

    public function addCors(): void
    {
        $cors = new Cors();

        $cors->execute();
    }

    public function exit(Response $response): void
    {
        $this->responseHandler->HandleResponse($response);
    }

    public function run(): void
    {
        $this->authManager?->authorize($this->request);

        $response = $this->router->resolve();

        $this->exit($response);
    }
}