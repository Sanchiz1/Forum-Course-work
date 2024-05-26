<?php

namespace Core\Routing;

use Core\Application;
use Core\Auth\AuthService;
use Core\Controller\ControllerFinder;
use Core\Controller\NotFoundController;
use Core\Http\Request;
use Core\Http\Response;

class Router
{
    private AuthService $authService;
    private Request $request;
    protected array $routeMap = [];

    public function __construct(Request $request)
    {
        $this->request = $request;

        $controllers = ControllerFinder::getControllerClasses();

        $this->routeMap = RouteParser::GetRoutes($controllers);

        $this->authService = new AuthService();
    }

    public function getRouteMap($method): array
    {
        return $this->routeMap[$method] ?? [];
    }

    public function resolve() : Response
    {
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

        $this->authService->CheckCallback($callback, $this->request);

        return call_user_func($callback, $this->request);
    }

    public function getCallback()
    {
        $url = $this->request->getUri();

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