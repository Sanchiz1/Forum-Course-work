<?php

namespace Core\Controller\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class Post extends MethodRoute
{
    public function __construct(string $routePath)
    {
        parent::__construct($routePath, 'POST');
    }
}