<?php

namespace App\Models;

use Core\Database\DbModel;

class Report extends DbModel
{

    public int $Id;
    public string $Text;
    public string $DateCreated;
    public int $PostId;

    public function attributes(): array
    {
        return ["Text", "DateCreated", "PostId"];
    }

    public function insertColumns(): array
    {
        return ["Text", "PostId"];
    }
}