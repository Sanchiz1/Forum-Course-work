<?php

namespace App\Models\TestModels;

use Core\Database\Attributes\ForeignKey;
use Core\Database\DbModel;

class TaskUser extends DbModel
{
    public int $Id;
    public string $Username;
    public string $Email;

    public function attributes(): array
    {
        return ["Username", "Email"];
    }
}