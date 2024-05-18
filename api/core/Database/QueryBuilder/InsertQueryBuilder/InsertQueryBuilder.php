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

    public function execute(): bool
    {
        $statement = Database::$db->prepare($this->query);

        foreach ($this->params as $param => $value) {
            $statement->bindValue(":$param", $value);
        }

        return $statement->execute();
    }
}