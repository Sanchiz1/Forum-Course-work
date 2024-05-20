<?php

namespace Core\Database\EntityMapper;

use Core\Database\Attributes\ForeignKey;
use Core\Database\DbModel;
use Core\Database\QueryBuilder\QueryBuilder;
use Core\Database\QueryBuilder\SelectQueryBuilder\SelectQueryBuilder;
use Exception;
use ReflectionClass;
use ReflectionException;

class EntityMapper implements IWhere, IInclude, IThenInclude
{
    private int $modelIndex = 0;
    private DbModel $currentModel;
    private string $tableName;
    private array $aliases = array();
    private DbModel $model;
    private array $models;
    private SelectQueryBuilder $queryBuilder;

    public function __construct(string $tableName, string $model, SelectQueryBuilder $queryBuilder)
    {
        $this->queryBuilder = $queryBuilder;
        $this->tableName = $tableName;
        $this->model = new $model();
        $this->models[$tableName] = $this->model;

        $alias = $this->getAlias(0);

        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $this->model->columns());
        $this->queryBuilder->select(...$columns)->from($tableName, $alias);
    }

    public function include(string $navigation, string $table): IThenInclude
    {
        $this->modelIndex = 0;
        $this->currentModel = $this->model;

        $property = "";
        $foreignKey = $this->getForeignKey($this->currentModel, $navigation, $property);

        $navigationModel = new $property();
        $this->models[$table] = $navigationModel;

        $tableName = array_keys($this->aliases)[$this->modelIndex] . "." . $table;

        $alias = $this->getAlias($navigation);

        $this->join($table, $this->currentModel->{$navigation}, $foreignKey, $navigation);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $navigationModel;

        return $this;
    }

    public function includeAndSelect(string $navigation, string $table): IThenInclude
    {
        $this->modelIndex = 0;
        $this->currentModel = $this->model;

        $property = "";
        $foreignKey = $this->getForeignKey($this->currentModel, $navigation, $property);

        $navigationModel = new $property();
        $this->models[$table] = $navigationModel;

        $navigationPath = array_keys($this->aliases)[$this->modelIndex] . "." . $navigation;

        $alias = $this->getAlias($navigationPath);

        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $navigationModel->columns());

        $this->join($table, $this->currentModel->{$navigation}, $foreignKey, $navigation);

        $this->queryBuilder->addSelect(...$columns);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $navigationModel;

        return $this;
    }


    function thenInclude(string $navigation, string $table): IThenInclude
    {
        $property = "";
        $foreignKey = $this->getForeignKey($this->currentModel, $navigation, $property);

        $navigationModel = new $property();
        $this->models[$table] = $navigationModel;

        $tableName = array_keys($this->aliases)[$this->modelIndex] . "." . $table;

        $alias = $this->getAlias($navigation);

        $this->join($table, $this->currentModel->{$navigation}, $foreignKey, $navigation);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $navigationModel;

        return $this;
    }

    function thenIncludeAndSelect(string $navigation, string $table): IThenInclude
    {
        $property = "";
        $foreignKey = $this->getForeignKey($this->currentModel, $navigation, $property);

        $navigationModel = new $property();
        $this->models[$table] = $navigationModel;

        $navigationPath = array_keys($this->aliases)[$this->modelIndex] . "." . $navigation;

        $alias = $this->getAlias($navigationPath);

        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $navigationModel->columns());

        $this->join($table, $this->currentModel->{$navigation}, $foreignKey, $navigation);

        $this->queryBuilder->addSelect(...$columns);

        $this->modelIndex = count($this->aliases);
        $this->currentModel = $navigationModel;

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
            $entity = null;
            foreach ($this->aliases as $navigation => $alias) {

                if($navigation == 0){
                    $entity = unserialize(serialize($this->model));

                    foreach ($entity->columns() as $column) {
                        $entity->{$column} = $row[$alias . "_" . $column];
                    }
                }
                else{
                    $tablesPath = explode(".", substr($navigation, 2));
                    $nestedEntity = $entity;

                    foreach ($tablesPath as $property) {
                        $nestedEntity = $nestedEntity->{$property};
                    }

                    foreach ($nestedEntity->columns() as $column) {
                        $nestedEntity->{$column} = $row[$alias . "_" . $column];
                    }
                }
            }
            $entities[] = $entity;
        }

        return $entities;
    }

    private function join(string $table, $navigationModel, $foreignKey, string $navigation): void
    {
        $navigationPath = array_keys($this->aliases)[$this->modelIndex] . "." . $navigation;

        $alias = $this->getAlias($navigationPath);

        $this->queryBuilder->join("INNER",
            $table, $alias,
            "$alias" . "." . $navigationModel->primaryKey() . " = " . array_values($this->aliases)[$this->modelIndex] . "." . $foreignKey);
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
    private function getForeignKey(DbModel $model, string $navigationProperty, string &$navigationModel): string
    {
        $reflectionClass = new ReflectionClass($model::class);
        $property = $reflectionClass->getProperty($navigationProperty);
        $propertyAttributes = $property->getAttributes(ForeignKey::class, \ReflectionAttribute::IS_INSTANCEOF);

        if (count($propertyAttributes) == 0) {
            throw new Exception("Navigation property $$navigationProperty does not have a ForeignKey attribute");
        }

        $navigationModel = $property->getType()->getName();

        $model->{$navigationProperty} = new $navigationModel();
        return $propertyAttributes[0]->newInstance()->foreignKey;
    }
}