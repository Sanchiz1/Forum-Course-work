<?php

namespace Core\Database;

abstract class Model
{
    public function loadData($data)
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->{$key} = $value;
            }
        }
    }

    public function attributes()
    {
        return [];
    }

    public function labels()
    {
        return [];
    }

    public function getLabel($attribute)
    {
        return $this->labels()[$attribute] ?? $attribute;
    }

    public function rules()
    {
        return [];
    }

    public function errorMessage($rule)
    {
        return $this->errorMessages()[$rule];
    }

    protected function addErrorByRule(string $attribute, string $rule, $params = [])
    {
        $params['field'] ??= $attribute;
        $errorMessage = $this->errorMessage($rule);
        foreach ($params as $key => $value) {
            $errorMessage = str_replace("{{$key}}", $value, $errorMessage);
        }
        $this->errors[$attribute][] = $errorMessage;
    }

    public function addError(string $attribute, string $message)
    {
        $this->errors[$attribute][] = $message;
    }

    public function hasError($attribute)
    {
        return $this->errors[$attribute] ?? false;
    }

    public function getFirstError($attribute)
    {
        $errors = $this->errors[$attribute] ?? [];
        return $errors[0] ?? '';
    }
}