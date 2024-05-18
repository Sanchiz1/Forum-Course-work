<?php

namespace Core\Database\QueryBuilder\InsertQueryBuilder;

use Core\Database\Database;

class InsertQueryBuilder implements IInsert, IValues, IExecute
{
    private string $query;
    private array $params = array();

    public function __construct(string $tableName)
    {
        $this->query = "INSERT INTO $tableName ";
    }

    public function columns(string $columns): IValues
    {
        $this->query .= "($columns) ";
        return $this;
    }

    public function values(string $values): IExecute
    {
        $this->query .= "VALUES ($values)";
        return $this;
    }

    public function setParameter(string $parameter, $value): IExecute
    {
        $this->params[$parameter] = $value;
        return $this;
    }

    public function execute(): string
    {
        $statement = Database::$db->prepare($this->query);

        $statement->execute($this->params);
        return Database::$db->pdo->lastInsertId();
    }
}