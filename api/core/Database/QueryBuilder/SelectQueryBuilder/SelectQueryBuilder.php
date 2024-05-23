<?php

namespace Core\Database\QueryBuilder\SelectQueryBuilder;


use Core\Database\Database;
use PDO;

class SelectQueryBuilder implements ISelect, IWhere, IJoin, IFrom, IGroupBy, IHaving
{
    private array $columns = array();
    private string $from = "";
    private string $join = "";
    private string $where = "";
    private string $groupBy = "";
    private string $having = "";
    private string $orderBy = "";
    private string $limit = "";
    private array $params = array();

    public function __construct()
    {

    }

    public function select(string ...$columns): IFrom
    {
        array_push($this->columns, ...$columns);
        return $this;
    }

    public function addSelect(string ...$columns): IJoin
    {
        array_push($this->columns, ...$columns);
        return $this;
    }

    public function from(string $table, string $alias = null): IJoin
    {
        $this->from .= "FROM $table $alias ";
        return $this;
    }

    public function join(string $type, string $table, string $alias, string $condition): IJoin
    {
        $this->join .= "$type JOIN $table $alias ON $condition ";
        return $this;
    }

    public function where(string $condition): IWhere
    {
        $this->where .= "WHERE $condition ";
        return $this;
    }

    public function and(string $condition): IWhere
    {
        $this->where .= "AND $condition ";
        return $this;
    }

    public function or(string $condition): IWhere
    {
        $this->where .= "OR $condition ";
        return $this;
    }

    public function groupBy(string ...$columns): IGroupBy
    {
        $columns = implode(", ", $this->columns);
        $this->groupBy = "GROUP BY $columns ";
        return $this;
    }

    public function having(string $condition): IHaving
    {
        $this->having .= "HAVING $condition ";
        return $this;
    }

    public function andHaving(string $condition): IHaving
    {
        $this->having .= "AND $condition ";
        return $this;
    }

    public function orHaving(string $condition): IHaving
    {
        $this->having .= "OR $condition ";
        return $this;
    }

    public function orderBy(string $column, string $order = 'ASC'): IOrderBy
    {
        $this->orderBy .= "ORDER BY $column $order ";
        return $this;
    }

    public function limit(int $limit, int $offset = 0): IExecute
    {
        $this->limit .= "LIMIT $offset, $limit";
        return $this;
    }

    public function setParameter(string $parameter, $value): IExecute
    {
        $this->params[$parameter] = $value;
        return $this;
    }

    public function execute(): array
    {
        $statement = Database::$db->prepare($this->getQuery());

        $statement->execute($this->params);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getQuery(): string
    {
        $columns = implode(", ", $this->columns);
        return "SELECT $columns $this->from$this->join$this->where$this->orderBy$this->limit";
    }
}