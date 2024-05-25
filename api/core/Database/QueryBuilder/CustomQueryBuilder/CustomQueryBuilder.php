<?php

namespace Core\Database\QueryBuilder\CustomQueryBuilder;

use Core\Database\Database;
use PDO;

class CustomQueryBuilder implements IExecute
{
    private string $query;

    private array $params = array();

    public function __construct(string $query)
    {
        $this->query = $query;
    }

    public function setParameter(string $parameter, $value, $type): IExecute
    {
        $this->params[$parameter] = [$value, $type];
        return $this;
    }

    public function execute(): bool
    {
        $statement = Database::$db->prepare($this->query);

        return $statement->execute($this->params);
    }

    public function fetchAll(): array
    {
        $statement = Database::$db->prepare($this->query);

        foreach ($this->params as $param => $value) {
            $statement->bindValue(":$param", $value[0], $value[1]);
        }/*
        echo $statement->queryString;
        die();*/
        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
}