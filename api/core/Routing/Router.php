<?php

namespace Core\Routing;

use Core\Application;
use Core\Controller\ControllerFinder;
use Core\Controller\NotFoundController;
use Core\Http\Request;
use Core\Http\Response;

class Router
{
    private Request $request;
    protected array $routeMap = [];

    public function __construct(Request $request)
    {
        $this->request = $request;

        $controllers = ControllerFinder::getControllerClasses();

        $this->routeMap = RouteParser::GetRoutes($controllers);
    }

    public function getRouteMap($method): array
    {
        return $this->routeMap[$method] ?? [];
    }

    public function resolve() : Response
    {
        $method = $this->request->getMethod();
        $url = $this->request->getUri();

        $callback = $this->getCallback();

        if ($callback == null) {
            $controller = new NotFoundController();
            return $controller->NotFound();
        }

        if (is_array($callback)) {
            $controller = new $callback[0];
            $controller->action = $callback[1];
            $callback[0] = $controller;
        }

        return call_user_func($callback, $this->request);
    }

    public function getCallback()
    {
        $url = parse_url($this->request->getUri(), PHP_URL_PATH);

        $routes = $this->getRouteMap($this->request->getMethod());

        foreach ($routes as $route => $callback) {
            if ($this->match($route, $url, $matches)) {
                $this->request->setRouteParams($matches);
                return $callback;
            }
        }
        return null;
    }

    private function match($route, $url, &$matches): bool
    {
        $route = rtrim($route, '/');

        $matches = array();

        $pattern = "@^" . preg_replace('/(\\\{([^}]+)}|\\\:[a-zA-Z0-9\_\-]+)/', '([a-zA-Z0-9\-\_]+)', preg_quote($route)) . "$@D";

        if (preg_match($pattern, $url, $matches)) {

            array_shift($matches);
            return true;
        }

        return false;
    }
}