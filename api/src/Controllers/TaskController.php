<?php

namespace App\Controllers;

use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("tasks")]
class TaskController extends Controller
{

    #[Get("")]
    public function GetTasks() : Response
    {
        return new Response("tasks");
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

    #[Get(":id")]
    public function GetTask2(Request $request) : Response
    {
        return new Response("2");
    }
}