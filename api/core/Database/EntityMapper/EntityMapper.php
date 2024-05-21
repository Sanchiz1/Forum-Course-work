<?php

namespace Core\Database\EntityMapper;

use Core\Database\Attributes\ForeignKey;
use Core\Database\DbModel;
use Core\Database\QueryBuilder\QueryBuilder;
use Core\Database\QueryBuilder\SelectQueryBuilder\SelectQueryBuilder;
use Core\Exceptions\NotFoundException;
use Exception;
use ReflectionClass;
use ReflectionException;

class EntityMapper implements IWhere, IInclude, IThenInclude
{
    private const ROOT_PROPERTY_NAME = "";
    private int $modelIndex = 0;
    private int $paramIndex = 0;
    private DbModel $currentModel;
    private array $aliases = array();
    private DbModel $model;
    private SelectQueryBuilder $queryBuilder;

    public function __construct(string $tableName, string $model, SelectQueryBuilder $queryBuilder)
    {
        $this->queryBuilder = $queryBuilder;
        $this->model = new $model();

        $alias = $this->getAlias(EntityMapper::ROOT_PROPERTY_NAME);

        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $this->model->columns());
        $this->queryBuilder->select(...$columns)->from($tableName, $alias);
    }

    public function include(string $navigation, string $table): IThenInclude
    {
        $this->modelIndex = 0;
        $this->currentModel = $this->model;

        $this->join($table, $navigation);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $this->currentModel->{$navigation};

        return $this;
    }

    public function includeAndSelect(string $navigation, string $table): IThenInclude
    {
        $this->modelIndex = 0;
        $this->currentModel = $this->model;

        $this->join($table, $navigation);

        $this->addColumns($navigation);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $this->currentModel->{$navigation};

        return $this;
    }


    function thenInclude(string $navigation, string $table): IThenInclude
    {
        $this->join($table, $navigation);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $this->currentModel->{$navigation};

        return $this;
    }

    function thenIncludeAndSelect(string $navigation, string $table): IThenInclude
    {
        $this->join($table, $navigation);

        $this->addColumns($navigation);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $this->currentModel->{$navigation};

        return $this;
    }

    public function where(string $column, $value = null): IWhere
    {
        $param = $this->GetParameterName();
        $this->queryBuilder->where($column);
        return $this;
    }

    public function and(string $condition, $value): IWhere
    {
        $this->query .= "AND $condition ";
        return $this;
    }

    public function or(string $condition, $value): IWhere
    {
        $this->query .= "OR $condition ";
        return $this;
    }

    public function orderBy(string $column, string $order = 'ASC'): IOrderBy
    {
        $this->query .= "ORDER BY $column $order";
        return $this;
    }

    public function limit(int $limit): ITake
    {
        $this->query .= "LIMIT $limit";
        return $this;
    }

    public function skip(int $offset): IExecute
    {
        $this->query .= "OFFSET $offset";
        return $this;
    }

    public function setParameter(string $parameter, $value): IExecute
    {
        $this->params[$parameter] = $value;
        return $this;
    }

    public function execute(): array
    {
        $data = $this->queryBuilder->execute();

        $entities = [];

        foreach ($data as $row) {
            $entities[] = $this->MapEntities($row);
        }

        return $entities;
    }

    private function MapEntities($row): DbModel
    {
        $entity = null;
        foreach ($this->aliases as $navigation => $alias) {

            if ($navigation == EntityMapper::ROOT_PROPERTY_NAME) 
            {
                $entity = unserialize(serialize($this->model));

                $this->setEntityFields($entity, $row, $alias);
            } 
            else 
            {
                $tablesPath = explode(".", $navigation);
                $nestedEntity = $entity;

                foreach ($tablesPath as $property) {
                    $nestedEntity = $nestedEntity->{$property};
                }
                
                $this->setEntityFields($nestedEntity, $row, $alias);
            }
        }
        return $entity;
    }

    private function setEntityFields(&$entity, $row, string $alias): void
    {
        foreach ($entity->columns() as $column) {
            $entity->{$column} = $row[$alias . "_" . $column];
        }
    }

    private function join(string $table, string $navigation): void
    {
        $navigationPath = $this->getNavigationPath($navigation);

        $alias = $this->getAlias($navigationPath);
        
        $foreignKey = $this->getForeignKey($this->currentModel, $navigation);

        $this->queryBuilder->join(
            "INNER",
            $table,
            $alias,
            "$alias" . "." . $this->currentModel->{$navigation}->primaryKey() . " = " . array_values($this->aliases)[$this->modelIndex] . "." . $foreignKey
        );
    }

    private function addColumns(string $navigation): void
    {
        $navigationPath = $this->getNavigationPath($navigation);

        $alias = $this->getAlias($navigationPath);

        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $this->currentModel->{$navigation}->columns());

        $this->queryBuilder->addSelect(...$columns);
    }

    private function GetParameterName() : string
    {
        $number = $this->paramIndex++;

        return ":p$number";
    }

    private function getNavigationPath(string $navigation): string
    {
        $navigationPath = $this->modelIndex == 0 ? "" : array_keys($this->aliases)[$this->modelIndex] . ".";

        return $navigationPath . $navigation;
    }


    private function getAlias(string $navigationProperty): string
    {
        if (array_key_exists($navigationProperty, $this->aliases)) {
            return $this->aliases[$navigationProperty];
        }

        $alias = "t";
        $number = count($this->aliases);

        $this->aliases[$navigationProperty] = "$alias$number";

        return "$alias$number";
    }


    /**
     * @throws ReflectionException
     * @throws Exception
     */
    private function getForeignKey(DbModel $model, string $navigationProperty): string
    {
        $reflectionClass = new ReflectionClass($model::class);
        $property = $reflectionClass->getProperty($navigationProperty);
        $propertyAttributes = $property->getAttributes(ForeignKey::class, \ReflectionAttribute::IS_INSTANCEOF);

        if (count($propertyAttributes) == 0) {
            throw new NotFoundException("ForeignKey attribute of property $navigationProperty not found");
        }

        $navigationModel = $property->getType()->getName();

        $model->{$navigationProperty} = new $navigationModel();
        return $propertyAttributes[0]->newInstance()->foreignKey;
    }
}