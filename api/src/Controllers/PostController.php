<?php

namespace App\Controllers;

use App\Data\Repositories\PostRepository;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Auth\Attributes\Requires;
use Core\Auth\Attributes\RequiresNone;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("posts")]
class PostController extends Controller
{
    private PostRepository $postRepository;
    public function __construct()
    {
        $this->postRepository = new PostRepository();
    }

    #[Anonymous]
    #[Get("")]
    public function GetPosts(Request $request): Response
    {
        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->postRepository->GetPosts($userId, $take, $skip, $orderBy, 'DESC')
            )
        );
    }

    #[Anonymous]
    #[Get("{id}")]
    public function GetPost(Request $request): Response
    {
        $postId = (int)$request->getRouteParam(0);
        $userId = $this->UserClaim("Id", 0);
        return $this->json($this->ok($this->postRepository->GetPost($postId, $userId)));
    }
}