<?php

namespace Core\Database;

use app\core\Application;
use Core\Database\QueryBuilder\ISelect;
use Core\Database\QueryBuilder\SelectQueryBuilder;
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

    public function Add(DbModel $model): bool
    {
        $tableName = $this->TableName;
        $attributes = $model->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);
        $statement = self::prepare("INSERT INTO $tableName (" . implode(",", $attributes) . ") VALUES (" . implode(",", $params) . ")");
        foreach ($attributes as $attribute) {
            $statement->bindValue(":$attribute", $model->{$attribute});
        }
        $statement->execute();
        return true;
    }

    public function Update(DbModel $model): bool
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

    public function Delete($filters = []): bool
    {
        $tableName = $this->TableName;
        $attributes = array_keys($filters);

        $conditions = implode(" AND ", array_map(fn($key, $value) => "$key  $value[0] :$key", $attributes, $filters));

        $where = $conditions != "" ? "WHERE $conditions" : "";

        $statement = self::prepare("DELETE FROM $tableName $where");

        foreach ($attributes as $attribute) {
            $statement->bindValue(":$attribute", $filters[$attribute][1]);
        }

        return $statement->execute();
    }
}