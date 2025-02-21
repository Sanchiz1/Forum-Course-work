<?php

namespace Core\Controller\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class MethodRoute
{
    public function __construct(public string $routePath, public string $method)
    {
    }
}