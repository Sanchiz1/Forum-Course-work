<?php

namespace Core\Database;

use Core\Database\QueryBuilder\DeleteQueryBuilder\DeleteQueryBuilder;
use Core\Database\QueryBuilder\DeleteQueryBuilder\IDelete;
use Core\Database\QueryBuilder\InsertQueryBuilder\IInsert;
use Core\Database\QueryBuilder\InsertQueryBuilder\InsertQueryBuilder;
use Core\Database\QueryBuilder\SelectQueryBuilder\ISelect;
use Core\Database\QueryBuilder\SelectQueryBuilder\SelectQueryBuilder;
use PDO;

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

    public function get(): ISelect
    {
        return new SelectQueryBuilder($this->TableName, $this->Model);
    }

    public function add(DbModel $model): string
    {
/*
        $tableName = $this->TableName;
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);
        $statement = Database::$db->prepare("INSERT INTO $tableName (" . implode(",", $attributes) . ") VALUES (" . implode(",", $params) . ")");
        foreach ($attributes as $attribute) {
            $statement->bindValue(":$attribute", $model->{$attribute});
        }

        echo json_encode($statement);
        die();
        $statement->execute();
        return true;*/
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $builder = $this->Insert()->columns(implode(", ", $attributes))
            ->values(implode(", ", $params));

        foreach ($attributes as $attribute) {
            $builder->setParameter(":$attribute", $model->{$attribute});
        }

        return $builder->execute();
    }

    public function insert(): IInsert
    {
        return new InsertQueryBuilder($this->TableName);
    }

    public function update(DbModel $model): bool
    {
        $tableName = $this->TableName;
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $set = implode(", ", array_map(fn($column, $value) => "$column  = $value", $attributes, $params));

        $where = $model->primaryKey() . ' = :' . $model->primaryKey();

        $statement = self::prepare("UPDATE $tableName SET $set WHERE $where");

        $statement->bindValue(':' . $model->primaryKey(), $model->{$model->primaryKey()});
        foreach ($attributes as $attribute) {
            $statement->bindValue(":$attribute", $model->{$attribute});
        }

        return $statement->execute();
    }

    public function delete(): IDelete
    {
        return new DeleteQueryBuilder($this->TableName, $this->Model);
    }
}