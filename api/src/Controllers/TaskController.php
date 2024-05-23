<?php

namespace App\Controllers;

use App\Models\Task;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Database\DbSet;
use Core\Http\Request;
use Core\Http\Response;

#[Route("tasks")]
class TaskController extends Controller
{
    private DbSet $tasks;

    public function __construct()
    {
        $this->tasks = new DbSet("task", Task::class);
    }
    #[Get("")]
    public function GetTasks() : Response
    {
        return $this->json(
            $this->ok($this->tasks->get()->includeAndSelect("User", "user")->execute())
        );
    }

    #[Get("new?id")]
    public function GetTaskBy(Request $request) : Response
    {
        return new Response($request->getRouteParams());
    }

    #[Get("{id}")]
    public function GetTask(Request $request) : Response
    {
        return new Response($request->getRouteParams());
    }
}