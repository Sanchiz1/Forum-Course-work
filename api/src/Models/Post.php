<?php

namespace App\Models;

use Core\Database\DbModel;
use DateTime;

class Post extends DbModel
{
    public int $Id;
    public string $Title;
    public string $Text;
    public DateTime $DateCreated;
    public DateTime $DateEdited;
    public int $UserId;

    public function attributes(): array
    {
        return ["Title", "Text", "DateCreated", "DateEdited", "UserId"];
    }
}