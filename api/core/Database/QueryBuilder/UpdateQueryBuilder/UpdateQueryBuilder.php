<?php

namespace Core\Database\QueryBuilder\UpdateQueryBuilder;

use Core\Database\Database;

class UpdateQueryBuilder implements IUpdate, ISet, IWhere
{
    private string $query;
    private array $setStrings;
    private array $params = array();

    public function __construct(string $tableName)
    {
        $this->query = "UPDATE $tableName SET ";
    }

    function set(string $key, $value): ISet
    {
        $this->setStrings[] = "$key = $value";
        return $this;
    }

    public function where(string $condition): IWhere
    {
        $this->query .= implode(",", $this->setStrings) . " ";
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

    public function execute(): bool
    {
        $statement = Database::$db->prepare($this->query);

        return $statement->execute($this->params);
    }
}