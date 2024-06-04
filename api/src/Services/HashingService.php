<?php

namespace App\Services;

class HashingService
{
    public function HashPassword(string $password) : string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function ComparePassword(string $password, string $hash) : bool
    {
        return password_verify($password, $hash);
    }
}