<?php

namespace App\Data\Repositories;

use App\Models\Post;
use App\Models\User;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class UserRepository
{
    private QueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->queryBuilder = new QueryBuilder();
    }

    public function GetUserByCredentials(string $usernameOrEmail, string $password): ?User
    {
        $query = "SELECT
                r.Name AS Role,
                u.RoleId AS RoleId,
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                WHERE (u.Username = :UsernameOrEmail 
                           OR u.Email = :UsernameOrEmail) 
                  AND u.Password = :Password";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UsernameOrEmail", $usernameOrEmail, PDO::PARAM_STR)
            ->setParameter("Password", $password, PDO::PARAM_STR)
            ->fetchFirst(User::class);
    }
}