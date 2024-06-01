<?php

namespace Core\Auth;

use Core\Application;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Auth\Attributes\Requires;
use Core\Auth\Attributes\RequiresNone;
use Core\Http\Request;
use Core\Http\Response;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionException;

class AuthService
{
    /**
     * @throws ReflectionException
     */
    public function CheckCallback(array $callback, Request $request): void
    {
        if (Application::$app->authManager == null) return;

        if (!$this->checkMethod($callback)) {
            Application::$app->exit(new Response(401, null));
        }

        if (!$this->checkClass($callback)) {
            Application::$app->exit(new Response(401, null));
        }
    }

    /**
     * @throws ReflectionException
     */
    private function checkMethod(array $callback): bool
    {
        $reflectionClass = new ReflectionClass($callback[0]);
        $reflectionMethod = $reflectionClass->getMethod($callback[1]);

        $isMethodAuthorize = $this->hasAttribute(
            $reflectionMethod->getAttributes(Authorize::class, ReflectionAttribute::IS_INSTANCEOF)
        );

        if ($isMethodAuthorize && !Application::$app->authManager?->isAuthorized()) {
            return false;
        }

        $requiresAttributes = $reflectionClass->getAttributes(Requires::class, ReflectionAttribute::IS_INSTANCEOF);
        $requirements = array();

        foreach ($requiresAttributes as $attr){
            $requirement = $attr->newInstance();

            $requirements[$requirement->claim] = $requirement->value;
        }

        $user = Application::$app->authManager?->getUserClaims();

        foreach ($requirements as $name => $value) {
            if(!in_array($user[$name], $value)){
                return false;
            }
        }

        return true;
    }

    /**
     * @throws ReflectionException
     */
    private function checkClass(array $callback): bool
    {
        $reflectionClass = new ReflectionClass($callback[0]);
        $reflectionMethod = $reflectionClass->getMethod($callback[1]);

        $isMethodAnonymous = $this->hasAttribute(
            $reflectionMethod->getAttributes(Anonymous::class, ReflectionAttribute::IS_INSTANCEOF)
        );

        $isMethodRequiresNone = $this->hasAttribute(
            $reflectionMethod->getAttributes(RequiresNone::class, ReflectionAttribute::IS_INSTANCEOF)
        );

        $isClassAuthorize = $this->hasAttribute(
            $reflectionClass->getAttributes(Authorize::class, ReflectionAttribute::IS_INSTANCEOF)
        );

        if ($isClassAuthorize && !Application::$app->authManager?->isAuthorized() && !$isMethodAnonymous ) {
            return false;
        }

        if ($isMethodRequiresNone) {
            return true;
        }

        $requiresAttributes = $reflectionClass->getAttributes(Requires::class, ReflectionAttribute::IS_INSTANCEOF);
        $requirements = array();

        foreach ($requiresAttributes as $attr){
            $requirement = $attr->newInstance();

            $requirements[$requirement->claim] = $requirement->value;
        }

        $user = Application::$app->authManager?->getUserClaims();

        foreach ($requirements as $name => $value) {
            if(!in_array($user[$name], $value)){
                return false;
            }
        }

        return true;
    }

    private function hasAttribute(array $attributes): bool
    {
        return count($attributes) != 0;
    }
}