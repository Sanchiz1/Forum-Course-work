<?php

namespace App\Models;

use Core\Database\DbModel;
use DateTime;

class Post extends DbModel
{
    public int $Id;
    public string $Title;
    public string $Text;
    public string $DateCreated;
    public string $DateEdited;
    public int $Likes;
    public int $UserId;

    public function attributes(): array
    {
        return ["Title", "Text", "DateCreated", "DateEdited", "Likes", "UserId"];
    }
}