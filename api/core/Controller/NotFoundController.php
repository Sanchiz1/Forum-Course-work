<?php

namespace Core\Controller;

use Core\Http\Response;

class NotFoundController extends Controller
{
    public function NotFound() : Response
    {
        return new Response(404, null);
    }
}