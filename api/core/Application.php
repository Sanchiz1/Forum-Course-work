<?php

namespace Core;

use Core\Controller\Controller;
use Core\Database\Database;
use Core\Http\Request;
use Core\Http\RequestParser;
use Core\Http\Response;
use Core\Routing\Router;

class Application
{
    public static Application $app;
    public Request $request;
    public Router $router;
    public Database $db;

    public function __construct($config)
    {
        self::$app = $this;
        $this->request = RequestParser::getRequest();
        $this->router = new Router($this->request);
        $this->db = new Database($config['db']);
    }

    public function run()
    {
        return $this->router->resolve();
    }
}