<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;


use Core\Database\Database;
use PDO;

class SelectQueryBuilder implements ISelect, IWhere, IJoin, IFrom
{
    private array $columns = array();
    private string $query;
    private array $params = array();

    public function __construct()
    {
        $this->query = "";
    }

    public function select(string ...$columns) : IFrom
    {
        array_push($this->columns, ...$columns);
        return $this;
    }

    public function addSelect(string ...$columns) : IJoin
    {
        array_push($this->columns, ...$columns);
        return $this;
    }

    public function from(string $table, string $alias = null) : IJoin
    {
        $this->query .= "FROM $table $alias ";
        return $this;
    }

    public function join(string $type, string $table, string $alias, string $condition) : IJoin
    {
        $this->query .= "$type JOIN $table $alias ON $condition ";
        return $this;
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
        $this->query .= "ORDER BY $column $order ";
        return $this;
    }

    public function limit(int $limit, int $offset = 0): IExecute
    {
        $this->query .= "LIMIT $offset, $limit";
        return $this;
    }

    public function setParameter(string $parameter, $value): IExecute
    {
        $this->params[$parameter] = $value;
        return $this;
    }

    public function execute(): array
    {
        $columns = implode(", ", $this->columns);
        $statement = Database::$db->prepare("SELECT $columns $this->query");

/*
        echo json_encode($statement);
        die();*/
        $statement->execute($this->params);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
}