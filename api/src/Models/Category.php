<?php

namespace App\Models;

use Core\Database\DbModel;

class Category extends DbModel
{

    public int $Id;
    public string $Title;

    public function attributes(): array
    {
        return ["Title"];
    }
}