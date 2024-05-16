<?php

namespace Core\Controller;

use Core\Config\CoreConfig;
use Core\Exceptions\NotFoundException;
use ReflectionClass;

class ControllerFinder
{
    /**
     * @throws NotFoundException
     * @throws \ReflectionException
     */
    public static function getControllerClasses() : array
    {
        $controllersPath = CoreConfig::GetControllersPath();
        $controllerClasses = [];

        if (!is_dir($controllersPath)) {
            throw new NotFoundException("Controllers directory not found: $controllersPath");
        }

        $files = scandir($controllersPath);

        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) == 'php') {
                require_once $controllersPath . '/' . $file;

                $declaredClasses = get_declared_classes();

                foreach ($declaredClasses as $className) {
                    $reflectionClass = new ReflectionClass($className);

                    if ($reflectionClass->isSubclassOf(Controller::class)) {
                        $controllerClasses[] = $className;
                    }
                }
            }
        }

        return $controllerClasses;
    }
}