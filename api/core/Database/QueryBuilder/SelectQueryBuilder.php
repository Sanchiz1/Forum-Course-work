<?php

namespace Core\Database\QueryBuilder;


use Core\Database\Database;
use PDO;

interface IOffset
{
    function setParameter(string $parameter, $value): IOffset;

    function execute(): array;
}

interface ILimit extends IOffset
{
    function offset(int $offset): IOffset;
}

interface IOrderBy extends ILimit
{
    function limit(int $limit): ILimit;
}

interface IWhere extends IOrderBy
{
    function and(string $condition): IWhere;

    function or(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}

interface ISelect extends IOrderBy
{
    function where(string $condition): IWhere;

    function orderBy(string $column, string $order = 'ASC'): IOrderBy;
}

class SelectQueryBuilder implements ISelect, IWhere
{
    private string $model;
    private string $query;
    private array $params = array();

    public function __construct(string $tableName, string $model)
    {
        $this->model = $model;
        $this->query = "SELECT * FROM $tableName ";
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

    public function orderBy(string $column, string $order = 'ASC'): IOrderBy
    {
        $this->query .= "ORDER BY $column $order";
        return $this;
    }

    public function limit(int $limit): ILimit
    {
        $this->query .= "LIMIT $limit";
        return $this;
    }

    public function offset(int $offset): IOffset
    {
        $this->query .= "OFFSET $offset";
        return $this;
    }

    public function setParameter(string $parameter, $value): IOffset
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