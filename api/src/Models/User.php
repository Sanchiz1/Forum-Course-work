<?php

namespace App\Models;

use Core\Database\Attributes\ForeignKey;
use Core\Database\DbModel;

class User extends DbModel
{
    public int $Id;
    public string $Username;
    public string $Email;
    public string $Password;

    public function attributes(): array
    {
        return ["Email", "Username", "Password"];
    }

    public function selectAttributes(): array
    {
        return ["Email", "Username"];
    }
}