<?php

namespace App\Controllers;

use App\Data\Repositories\PostRepository;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Auth\Attributes\Requires;
use Core\Auth\Attributes\RequiresNone;
use Core\Controller\Attributes\Delete;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Patch;
use Core\Controller\Attributes\Post;
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
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->postRepository->GetPosts($userId, $userTimestamp, $take, $skip, $orderBy, 'DESC')
            )
        );
    }

    #[Anonymous]
    #[Get("user/{username}")]
    public function GetUserPosts(Request $request): Response
    {
        $username = $request->getRouteParam(0);
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->postRepository->GetUserPosts($userId, $userTimestamp, $username, $take, $skip, $orderBy, 'DESC')
            )
        );
    }

    #[Anonymous]
    #[Get("{id}")]
    public function GetPost(Request $request): Response
    {
        $postId = (int)$request->getRouteParam(0);
        $userId = $this->UserClaim("id", 0);
        return $this->json($this->ok($this->postRepository->GetPost($userId, $postId)));
    }

    #[Authorize]
    #[Post("")]
    public function AddPost(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $title = $request->getBody()["title"];
        $text = $request->getBody()["text"];

        $res = $this->postRepository->AddPost($userId, $title, $text);

        if ($res == null) {
            return $this->json(
                $this->badRequest("Failed to create user")
            );
        }

        return $this->json(
            $this->ok()
        );
    }

    #[Anonymous]
    #[Patch("{id}")]
    public function UpdatePost(Request $request): Response
    {
        $postId = (int)$request->getRouteParam(0);
        $text = $request->getBody()["text"];

        $this->postRepository->UpdatePost($postId, $text);

        return $this->json($this->ok());
    }

    #[Anonymous]
    #[Delete("{id}")]
    public function DeletePost(Request $request): Response
    {
        $postId = (int)$request->getRouteParam(0);

        $this->postRepository->DeletePost($postId);

        return $this->json($this->ok());
    }
}