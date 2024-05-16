<?php

namespace App\Controllers;

use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;

#[Route("tasks")]
class TaskController extends Controller
{

    #[Get("")]
    public function GetTasks()
    {

    }

    #[Get(":id")]
    public function GetTask()
    {

    }
}