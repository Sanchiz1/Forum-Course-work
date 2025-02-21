<?php

namespace Core\Controller;

use Core\Http\Response;

class NotFoundController extends Controller
{
    public function Index() : Response
    {
        return new Response(404, null);
    }
}