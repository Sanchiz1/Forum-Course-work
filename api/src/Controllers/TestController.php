<?php

namespace App\Controllers;

use App\Models\TestModels\Task;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\MethodRoute;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Database\DbSet;
use Core\Http\Request;
use Core\Http\Response;

#[Route("test")]
class TestController extends Controller
{

    private DbSet $tasks;

    public function __construct()
    {
        $this->tasks = new DbSet("task", Task::class);
    }

    #[Get("")]
    public function GetTasks(Request $request): Response
    {
        $tasks = $this->tasks
            ->get()
            ->includeAndSelect("User", "taskuser")
            ->execute();

        return $this->json(
            $this->ok(
                $tasks
            ));
    }

    #[Get("query")]
    public function GetTasksQuery(Request $request): Response
    {
        $guery = $this->tasks
            ->get()
            ->includeAndSelect("User", "taskuser")
            ->where("UserId", "=", "", 1, \PDO::PARAM_INT)
            ->getQuery();

        return $this->json(
            $this->ok(
                $guery
            ));
    }
}