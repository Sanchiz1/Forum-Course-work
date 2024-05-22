<?php

namespace App\Models;

use Core\Database\Attributes\ForeignKey;
use Core\Database\DbModel;

class User extends DbModel
{
    public int $Id;
    public string $Email;
    public string $DisplayName;
    public string $Password;
    public int $InfoId;
    #[ForeignKey("InfoId")]
    public UserInfo $UserInfo;

    public function attributes(): array
    {
        return ["Email", "DisplayName", "Password"];
    }

    public static function CreateUser(string $email, string $displayName, string $password): User
    {
        $instance = new self();
        $instance->Email = $email;
        $instance->DisplayName = $displayName;
        $instance->Password = $password;
        return $instance;
    }
}