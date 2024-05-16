<?php

namespace Core\Controller\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class Patch extends MethodRoute
{
    public function __construct(string $routePath)
    {
        parent::__construct($routePath, 'PATCH');
    }
}