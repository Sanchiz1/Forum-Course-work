<?php

namespace Core\Database;

use Core\Database\QueryBuilder\DeleteQueryBuilder\DeleteQueryBuilder;
use Core\Database\QueryBuilder\DeleteQueryBuilder\IDelete;
use Core\Database\QueryBuilder\InsertQueryBuilder\IInsert;
use Core\Database\QueryBuilder\InsertQueryBuilder\InsertQueryBuilder;
use Core\Database\QueryBuilder\SelectQueryBuilder\ISelect;
use Core\Database\QueryBuilder\SelectQueryBuilder\SelectQueryBuilder;
use Core\Database\QueryBuilder\UpdateQueryBuilder\IUpdate;
use Core\Database\QueryBuilder\UpdateQueryBuilder\UpdateQueryBuilder;

class DbSet
{
    public string $TableName;
    public string $Model;

    public function __construct($tableName, $model)
    {
        $this->TableName = $tableName;
        $this->Model = $model;
    }

    public static function prepare($sql): \PDOStatement
    {
        return Application::$app->db->prepare($sql);
    }

    public function insertModel(DbModel $model): string
    {
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $builder = $this->insert()->columns(implode(", ", $attributes))
            ->values(implode(", ", $params));

        foreach ($attributes as $attribute) {
            $builder->setParameter(":$attribute", $model->{$attribute});
        }

        return $builder->execute();
    }

    public function updateModel(DbModel $model): bool
    {
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $builder = $this->update();


        foreach ($attributes as $attribute) {
            $builder->set("$attribute", ":$attribute")
                ->setParameter(":$attribute", $model->{$attribute});
        }

        $builder->where($model->primaryKey() . " = :" . $model->primaryKey())
            ->setParameter(":" . $model->primaryKey(), $model->{$model->primaryKey()});

        return $builder->execute();
    }

    public function get(): ISelect
    {
        return new SelectQueryBuilder($this->TableName, $this->Model);
    }

    public function update(): IUpdate
    {
        return new UpdateQueryBuilder($this->TableName);
    }

    public function insert(): IInsert
    {
        return new InsertQueryBuilder($this->TableName);
    }

    public function delete(): IDelete
    {
        return new DeleteQueryBuilder($this->TableName);
    }
}