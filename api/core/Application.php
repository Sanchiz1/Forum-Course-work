<?php

namespace Core;

use Core\Controller\Controller;
use Core\Database\Database;
use Core\Http\Request;
use Core\Http\RequestParser;
use Core\Http\Response;

class Application
{
    public static Application $app;
    public Request $request;
    public Response $response;
    public Router $router;
    public Database $db;
    public ?Controller $controller = null;

    public function __construct($config)
    {
        self::$app = $this;
        $this->request = RequestParser::getRequest();
        $this->response = new Response();
        $this->router = new Router($this->request, $this->response);
        $this->db = new Database($config['db']);
    }

    public function run()
    {
        $this->router->resolve();
    }
}