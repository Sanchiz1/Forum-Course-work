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

    public function GetUsers(string $userTimestamp, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts,
                r.Name AS Role,
                u.RoleId AS RoleId
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.DateRegistered < :UserTimestamp
                GROUP BY u.Id
                ORDER BY $orderBy $order
                LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserTimestamp", $userTimestamp, PDO::PARAM_STR)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(User::class);
    }

    public function GetUsersBySearch(string $search, string $userTimestamp, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts,
                r.Name AS Role,
                u.RoleId AS RoleId
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.DateRegistered < :UserTimestamp AND (u.Username LIKE :Search)
                GROUP BY u.Id
                ORDER BY $orderBy $order
                LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Search", $search, PDO::PARAM_STR)
            ->setParameter("UserTimestamp", $userTimestamp, PDO::PARAM_STR)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(User::class);
    }

    public function GetUserById(int $userId): ?User
    {
        $query = "SELECT
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts,
                r.Name AS Role,
                u.RoleId AS RoleId
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.Id = :UserId  
                GROUP BY u.Id";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->fetchFirst(User::class);
    }

    public function GetUserByUsername(string $username): ?User
    {
        $query = "SELECT
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts,
                r.Name AS Role,
                u.RoleId AS RoleId
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.Username = :Username  
                GROUP BY u.Id";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Username", $username, PDO::PARAM_STR)
            ->fetchFirst(User::class);
    }

    public function GetUserByEmail(string $email): ?User
    {
        $query = "SELECT
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts,
                r.Name AS Role,
                u.RoleId AS RoleId
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.Email = :Email   
                GROUP BY u.Id";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Email", $email, PDO::PARAM_STR)
            ->fetchFirst(User::class);
    }

    public function GetUserUsernameOrEmail(string $usernameOrEmail): ?User
    {
        $query = "SELECT
                u.Id AS Id,
                u.Username AS Username,
                u.Email AS Email,
                u.Bio AS Bio,
                u.DateRegistered AS DateRegistered,
                Count(DISTINCT c.Id) + Count(DISTINCT rp.Id) as Comments,
                Count(DISTINCT p.Id) as Posts,
                r.Name AS Role,
                u.RoleId AS RoleId
                FROM user u
                LEFT JOIN role r ON r.Id = u.RoleId
                LEFT JOIN post p ON p.UserId = u.Id
                LEFT JOIN comment c ON c.UserId = u.Id
                LEFT JOIN reply rp ON rp.UserId = u.Id
                WHERE u.Username = :UsernameOrEmail
                           OR u.Email = :UsernameOrEmail
                GROUP BY u.Id";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UsernameOrEmail", $usernameOrEmail, PDO::PARAM_STR)
            ->fetchFirst(User::class);
    }

    public function GetUserPassword(int $userId): string
    {
        $query = "SELECT
                u.Password AS Password
                FROM user u
                WHERE u.Id = :UserId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->fetchScalar();
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

    public function UpdateUser(int $userId, string $username, string $email, ?string $bio): bool
    {
        $query = "UPDATE user SET Username = :Username, Email = :Email, Bio = :Bio WHERE Id = :UserId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("Username", $username, PDO::PARAM_STR)
            ->setParameter("Email", $email, PDO::PARAM_STR)
            ->setParameter("Bio", $bio, PDO::PARAM_STR)
            ->execute();
    }

    public function UpdateUserRole(int $userId, int $roleId): bool
    {
        $query = "UPDATE user SET RoleId = :RoleId WHERE Id = :UserId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("RoleId", $roleId, PDO::PARAM_STR)
            ->execute();
    }

    public function UpdateUserPassword(int $userId, string $password): bool
    {
        $query = "UPDATE user SET Password = :Password WHERE Id = :UserId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("Password", $password, PDO::PARAM_STR)
            ->execute();
    }

    public function DeleteUser(int $userId): bool
    {
        $query = "DELETE FROM user WHERE Id = :UserId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->execute();
    }
}