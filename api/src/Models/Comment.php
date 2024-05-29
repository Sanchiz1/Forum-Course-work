<?php

namespace App\Models;

use Core\Database\DbModel;
use DateTime;

class Comment extends DbModel
{
    public int $Id;
    public string $Text;
    public string $DateCreated;
    public ?string $DateEdited;
    public int $Likes;
    public bool $Liked;
    public int $Replies;
    public int $UserId;

    public function attributes(): array
    {
        return ["Text", "DateCreated", "DateEdited", "Likes", "Liked", "Replies", "UserId"];
    }
}