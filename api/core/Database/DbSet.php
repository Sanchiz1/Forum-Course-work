<?php

namespace Core\Database;

use Core\Database\EntityMapper\EntityMapper;
use Core\Database\EntityMapper\IInclude;
use Core\Database\QueryBuilder\DeleteQueryBuilder\DeleteQueryBuilder;
use Core\Database\QueryBuilder\DeleteQueryBuilder\IDelete;
use Core\Database\QueryBuilder\InsertQueryBuilder\IInsert;
use Core\Database\QueryBuilder\InsertQueryBuilder\InsertQueryBuilder;
use Core\Database\QueryBuilder\QueryBuilder;
use Core\Database\QueryBuilder\SelectQueryBuilder\SelectQueryBuilder;
use PDO;

class DbSet
{
    public string $tableName;
    public string $model;
    public QueryBuilder $queryBuilder;

    public function __construct($tableName, $model)
    {
        $this->queryBuilder = new QueryBuilder();
        $this->tableName = $tableName;
        $this->model = $model;
    }

    public function insert(DbModel $model): string
    {
        $attributes = $model->insertColumns();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $builder = $this->queryBuilder->create($this->tableName)->columns(implode(", ", $attributes))
            ->values(implode(", ", $params));

        foreach ($attributes as $attribute) {
            $builder->setParameter(":$attribute", $model->{$attribute});
        }

        return $builder->execute();
    }

    public function update(DbModel $model): bool
    {
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $builder = $this->queryBuilder->update($this->tableName);


        foreach ($attributes as $attribute) {
            $builder->set("$attribute", ":$attribute")
                ->setParameter("$attribute", $model->{$attribute}, PDO::PARAM_STR);
        }

        $builder->where($model->primaryKey() . " = :" . $model->primaryKey())
            ->setParameter($model->primaryKey(), $model->{$model->primaryKey()}, PDO::PARAM_INT);

        return $builder->execute();
    }

    public function delete(DbModel $model): bool
    {
        $builder = $this->queryBuilder->delete($this->tableName);

        $builder->where($model->primaryKey() . " = :" . $model->primaryKey())
            ->setParameter($model->primaryKey(), $model->{$model->primaryKey()}, PDO::PARAM_INT);

        return $builder->execute();
    }

    public function get(): IInclude
    {
        return new EntityMapper($this->tableName, $this->model, new SelectQueryBuilder());
    }
}