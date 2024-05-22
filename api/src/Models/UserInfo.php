<?php

namespace App\Models;

use Core\Database\DbModel;

class UserInfo extends DbModel
{
    public int $Id;
    public string $Info;

    public function attributes(): array
    {
        return ['Info'];
    }
}