<?php

namespace Core\Auth\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
class Requires
{
    public function __construct(public string $claim, public array $value)
    {

    }
}