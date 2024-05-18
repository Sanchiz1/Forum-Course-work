<?php

namespace Core\Database\QueryBuilder\DeleteQueryBuilder;

use Core\Database\Database;
use PDO;

class DeleteQueryBuilder implements IDelete, IWhere
{
    private string $model;
    private string $query;
    private array $params = array();

    public function __construct(string $tableName, string $model)
    {
        $this->model = $model;
        $this->query = "Delete FROM $tableName ";
    }

    public function where(string $condition): IWhere
    {
        $this->query .= "WHERE $condition ";
        return $this;
    }

    public function and(string $condition): IWhere
    {
        $this->query .= "AND $condition ";
        return $this;
    }

    public function or(string $condition): IWhere
    {
        $this->query .= "OR $condition ";
        return $this;
    }
    public function setParameter(string $parameter, $value): IExecute
    {
        $this->params[$parameter] = $value;
        return $this;
    }

    public function execute(): array
    {
        $statement = Database::$db->prepare($this->query);

        foreach ($this->params as $param => $value) {
            $statement->bindValue(":$param", $value);
        }

        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_CLASS, $this->model);
    }
}