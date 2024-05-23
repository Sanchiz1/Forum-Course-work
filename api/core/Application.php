<?php

namespace Core;

use Core\Controller\Controller;
use Core\Database\Database;
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
    public ResponseHandler $responseHandler;

    public function __construct($config)
    {
        self::$app = $this;
        $this->request = RequestParser::getRequest();
        $this->router = new Router($this->request);
        $this->db = new Database($config['db']);
        $this->responseHandler = new ResponseHandler();
    }

    public function run(): void
    {
         $response = $this->router->resolve();

        $this->responseHandler->HandleResponse($response);
    }
}