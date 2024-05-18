<?php

namespace App\Models;

use Core\Database\DbModel;

class Task extends DbModel
{
    public int $Id;
    public string $Title;
    public int $UserId;

    public function attributes(): array
    {
        return ['Title', 'UserId'];
    }
}