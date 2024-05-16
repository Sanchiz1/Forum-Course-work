<?php

namespace Core\Config;

class CoreConfig
{
    public const string controllersPath = 'src/Controllers';

    public static function GetControllersPath() : string
    {
        return self::GetRootPath(self::controllersPath);
    }

    public static function GetRootPath(string $folder) : string
    {
        return dirname($_SERVER["DOCUMENT_ROOT"]) . "/" . $folder;
    }
}