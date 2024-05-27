<?php

use App\Identity\JwtManager;

require_once dirname(__DIR__) . '/vendor/autoload.php';


$config = [
    'db' => [
        'dsn' => "mysql:host=localhost;
        port=3306;
        dbname=forum",
        'user' => 'root',
        'password' => '',
    ]
];

$app = new Core\Application($config);

$app->addCors();
$app->addJwtAuth(new JwtManager());

$app->run();