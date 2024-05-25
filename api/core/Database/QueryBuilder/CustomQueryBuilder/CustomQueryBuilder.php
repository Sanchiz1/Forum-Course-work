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

    public function fetchAll(string $dbModel): array
    {
        $statement = Database::$db->prepare($this->query);

        foreach ($this->params as $param => $value) {
            $statement->bindValue(":$param", $value[0], $value[1]);
        }

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_CLASS, $dbModel);
    }

    public function fetchFirst(string $dbModel)
    {
        $statement = Database::$db->prepare($this->query);

        foreach ($this->params as $param => $value) {
            $statement->bindValue(":$param", $value[0], $value[1]);
        }

        $statement->execute();

        $statement->setFetchMode(PDO::FETCH_CLASS, $dbModel);
        return $statement->fetch();
    }
}