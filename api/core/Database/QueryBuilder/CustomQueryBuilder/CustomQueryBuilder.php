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

    public function fetchAll(): array
    {
        $statement = Database::$db->prepare($this->query);

        $statement->execute($this->params);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
}