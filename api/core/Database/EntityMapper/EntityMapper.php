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
    private const string ROOT_PROPERTY_NAME = "";
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
        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $this->model->selectColumns());
        $this->queryBuilder->select(...$columns)->from($tableName, $alias);
    }

    public function include(string $navigation, string $table): IThenInclude
    {
        $this->modelIndex = 0;
        $this->currentModel = $this->model;

        $this->join($table, $navigation, false);

        return $this;
    }

    public function includeAndSelect(string $navigation, string $table): IThenInclude
    {
        $this->modelIndex = 0;
        $this->currentModel = $this->model;

        $this->join($table, $navigation, true);

        return $this;
    }


    function thenInclude(string $navigation, string $table): IThenInclude
    {
        $this->join($table, $navigation, false);

        return $this;
    }

    function thenIncludeAndSelect(string $navigation, string $table): IThenInclude
    {
        $this->join($table, $navigation, true);

        return $this;
    }

    public function where(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere
    {
        $column1 = $this->getPropertyAlias($firstColumn);

        if($value == null)
        {
            $column2 = $this->getPropertyAlias($secondColumn);
            $this->queryBuilder->where("$column1 $condition $column2");

            return $this;
        }

        $param = $this->GetParameterName();

        $this->queryBuilder->where("$column1 $condition $param")
            ->setParameter($param, $value);

        return $this;
    }

    public function and(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere
    {
        $column1 = $this->getPropertyAlias($firstColumn);

        if($value == null)
        {
            $column2 = $this->getPropertyAlias($secondColumn);
            $this->queryBuilder->where("$column1 $condition $column2");

            return $this;
        }

        $param = $this->GetParameterName();

        $this->queryBuilder->and("$column1 $condition $param")
            ->setParameter($param, $value);

        return $this;
    }

    public function or(string $firstColumn, string $condition, string $secondColumn = "", $value = null): IWhere
    {
        $column1 = $this->getPropertyAlias($firstColumn);

        if($value == null)
        {
            $column2 = $this->getPropertyAlias($secondColumn);
            $this->queryBuilder->where("$column1 $condition $column2");

            return $this;
        }

        $param = $this->GetParameterName();

        $this->queryBuilder->or("$column1 $condition $param")
            ->setParameter($param, $value);

        return $this;
    }

    public function orderBy(string $column, string $order = 'ASC'): IOrderBy
    {
        $orderColumn = $this->getPropertyAlias($column);

        $this->queryBuilder->orderBy($orderColumn, $order);

        return $this;
    }

    public function limit(int $limit, int $offset = 0): IExecute
    {
        $this->queryBuilder->limit($limit, $offset);

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

            if(!$alias[1])
            {
                continue;
            }

            if ($navigation == EntityMapper::ROOT_PROPERTY_NAME) 
            {
                $entity = unserialize(serialize($this->model));

                $this->setEntityFields($entity, $row, $alias[0]);
            }
            else 
            {
                $tablesPath = explode(".", $navigation);
                $nestedEntity = $entity;

                foreach ($tablesPath as $property) {
                    $nestedEntity = $nestedEntity->{$property};
                }
                
                $this->setEntityFields($nestedEntity, $row, $alias[0]);
            }
        }
        return $entity;
    }

    private function setEntityFields(&$entity, $row, string $alias): void
    {
        foreach ($entity->selectColumns() as $column) {
            $entity->{$column} = $row[$alias . "_" . $column];
        }
    }

    private function join(string $table, string $navigation, bool $withColumns): void
    {
        $navigationPath = $this->getNavigationPath($navigation);

        $alias = $this->getAlias($navigationPath, $withColumns);

        $foreignKey = $this->getForeignKey($this->currentModel, $navigation, $withColumns, $this->currentModel);

        $this->queryBuilder->join(
            "INNER",
            $table,
            $alias,
            "$alias" . "." . $this->currentModel->primaryKey() . " = " . array_values($this->aliases)[$this->modelIndex][0] . "." . $foreignKey
        );

        if($withColumns)
        {
            $this->addColumns($navigation);
        }

        $this->modelIndex = count($this->aliases) - 1;
    }

    private function addColumns(string $navigation): void
    {
        $navigationPath = $this->getNavigationPath($navigation);

        $alias = $this->getAlias($navigationPath);

        $columns = array_map(fn($a) => "$alias.$a as $alias" . "_$a", $this->currentModel->selectColumns());

        $this->queryBuilder->addSelect(...$columns);
    }

    private function getPropertyAlias(string $property) : string
    {
        $array = explode(".", $property);

        $prop = array_pop($array);

        $navigation = implode(".", $array);

        $alias = $this->getAlias($navigation);

        return "$alias.$prop";
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


    private function getAlias(string $navigationProperty, bool $withSelect = true): string
    {
        if (!array_key_exists($navigationProperty, $this->aliases))
        {
            $alias = "t";
            $number = count($this->aliases);

            $this->aliases[$navigationProperty] = ["$alias$number", $withSelect];
        }

        return $this->aliases[$navigationProperty][0];
    }


    /**
     * @throws ReflectionException
     * @throws Exception
     */
    private function getForeignKey(DbModel $model, string $navigationProperty, bool $withColumns, &$navigationModel): string
    {
        $reflectionClass = new ReflectionClass($model::class);
        $property = $reflectionClass->getProperty($navigationProperty);
        $propertyAttributes = $property->getAttributes(ForeignKey::class, \ReflectionAttribute::IS_INSTANCEOF);

        if (count($propertyAttributes) == 0) {
            throw new NotFoundException("ForeignKey attribute of property $navigationProperty not found");
        }

        $navigationModelName =  $property->getType()->getName();

        $navigationModel =  new $navigationModelName();

        if($withColumns) $model->{$navigationProperty} = $navigationModel;

        return $propertyAttributes[0]->newInstance()->foreignKey;
    }
}