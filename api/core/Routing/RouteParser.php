<?php

namespace Core\Routing;

use Core\Controller\Attributes\MethodRoute;
use Core\Controller\Attributes\Route;
use ReflectionException;

class RouteParser
{
    /**
     * @throws ReflectionException
     * @throws \Exception
     */
    public static function GetRoutes(array $controllers): array
    {
        $routes = [];
        foreach ($controllers as $controller) {

            $reflectionController = new \ReflectionClass($controller);

            $controllerAttributes = $reflectionController
                ->getAttributes(Route::class, \ReflectionAttribute::IS_INSTANCEOF);

            if (count($controllerAttributes) == 0) {
                throw new \Exception("Controller $controller does not have Route attribute");
            }

            $route = $controllerAttributes[0]->newInstance()->routePath;

            foreach ($reflectionController->getMethods() as $method) {

                $methodAttributes = $method->getAttributes(MethodRoute::class, \ReflectionAttribute::IS_INSTANCEOF);

                if (count($methodAttributes) == 0) {
                    continue;
                }

                $methodRoute = $methodAttributes[0]->newInstance();

                $path = $route . '/' . $methodRoute->routePath;
                self::register($routes, $methodRoute->method, $path, [$controller, $method->getName()]);
            }
        }

        return $routes;
    }

    public
    static function register(array &$routes, string $requestMethod, string $route, callable|array $action): void
    {
        $routes[$requestMethod][$route] = $action;
    }
}