<?php

use App\Models\Task;
use Core\Controller\ControllerFinder;
use Core\Http\Response;

require_once dirname(__DIR__) . '/vendor/autoload.php';


$config = [
    'db' => [
        'dsn' => "mysql:host=localhost;
        port=3306;
        dbname=test",
        'user' => 'root',
        'password' => '',
    ]
];

$app = new Core\Application($config);

$app->run();