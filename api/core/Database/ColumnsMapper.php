<?php

namespace Core\Database;

class ColumnsMapper
{
    public static function MapColumns(array $data, string $modelClass) : array
    {
        $models = [];
        foreach ($data as $row) {
            $model = new $modelClass();

            foreach ($model->columns() as $column) {
                $model->{$column} = $row[$column];
            }

            $models[] = $model;
        }

        return  $models;
    }
}