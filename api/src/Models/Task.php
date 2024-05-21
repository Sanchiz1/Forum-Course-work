<?php

namespace App\Models;

use Core\Database\Attributes\ForeignKey;
use Core\Database\DbModel;

class Task extends DbModel
{
    public int $Id;
    public string $Title;
    public int $UserId;
    #[ForeignKey("UserId")]
    public User $User;

    public function attributes(): array
    {
        return ['Title', 'UserId'];
    }
}