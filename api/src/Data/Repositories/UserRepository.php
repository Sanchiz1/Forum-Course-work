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

    public function GetUserById(int $userId): ?User
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
                WHERE u.Id = :UserId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->fetchFirst(User::class);
    }

    public function GetUserByUsername(string $username): ?User
    {
        $query = "SELECT
                r.Name AS Role,
                u.RoleId AS RoleId,
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.Username = :Username";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Username", $username, PDO::PARAM_STR)
            ->fetchFirst(User::class);
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
    public function AddUser(string $username, string $email, ?string $bio, string $password): bool
    {
        $query = "INSERT INTO user 
                    (Username, Email, Bio, Password) 
                    VALUES (:Username, :Email, :Bio, :Password)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Username", $username, PDO::PARAM_STR)
            ->setParameter("Email", $email, PDO::PARAM_STR)
            ->setParameter("Bio", $bio, PDO::PARAM_STR)
            ->setParameter("Password", $password, PDO::PARAM_STR)
            ->execute();
    }
}