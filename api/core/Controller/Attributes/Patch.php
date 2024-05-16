<?php

namespace Core\Controller\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class Patch extends Route
{
    public function __construct(string $routePath)
    {
        parent::__construct($routePath, 'PATCH');
    }
}