<?php

namespace Core\Database;

class Database
{
    public static Database $db;
    public \PDO $pdo;

    public function __construct($dbConfig = [])
    {
        $dbDsn = $dbConfig['dsn'] ?? '';
        $username = $dbConfig['user'] ?? '';
        $password = $dbConfig['password'] ?? '';

        $this->pdo = new \PDO($dbDsn, $username, $password);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        self::$db = $this;
    }
    public function prepare($sql): \PDOStatement
    {
        return $this->pdo->prepare($sql);
    }
}