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
    public int $Comments;
    public int $UserId;
    public string $UserUsername;

    public function attributes(): array
    {
        return ["Title", "Text", "DateCreated", "DateEdited", "Likes", "Comments", "UserId", "UserUsername"];
    }
}