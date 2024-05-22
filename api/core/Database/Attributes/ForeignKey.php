<?php

namespace Core\Database\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
class ForeignKey
{
    public function __construct(public string $foreignKey)
    {
    }
}