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
use DateTime;

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
        $userTimestamp = date("yy-m-d h:i:s", strtotime($userTimestamp));

        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;


        $categories = $request->getQueryParams()["categories"] ?? '';

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->postRepository->GetPosts($userId, $userTimestamp, $take, $skip, $orderBy, 'DESC', $categories)
            )
        );
    }

    #[Anonymous]
    #[Get("search")]
    public function GetPostsBySearch(Request $request): Response
    {
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $userTimestamp = date("yy-m-d h:i:s", strtotime($userTimestamp));

        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $order = $request->getQueryParams()["order"] ?? "ASC";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;
        $search = $request->getQueryParams()["search"] ?? '%';

        $search = "%" . $search . "%";

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->postRepository->GetPostsBySearch($userId, $search, $userTimestamp, $take, $skip, $orderBy, $order)
            )
        );
    }

    #[Anonymous]
    #[Get("user/{username}")]
    public function GetUserPosts(Request $request): Response
    {
        $username = $request->getRouteParam(0);

        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $userTimestamp = date("yy-m-d h:i:s", strtotime($userTimestamp));

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

        $res = $this->postRepository->GetPost($userId, $postId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Post not found")
            );
        }

        return $this->json($this->ok($res));
    }

    #[Authorize]
    #[Post("")]
    public function AddPost(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $title = $request->getBody()["title"];
        $text = $request->getBody()["text"];

        if ($title == null) {
            return $this->json(
                $this->badRequest("Title was not set")
            );
        }

        if (strlen($title) > 500) {
            return $this->json(
                $this->badRequest("Title cannot be longer than 5000 symbols")
            );
        }

        if (strlen($text) > 5000) {
            return $this->json(
                $this->badRequest("Title cannot be longer than 5000 symbols")
            );
        }

        $res = $this->postRepository->AddPost($userId, $title, $text);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Patch("{id}")]
    public function UpdatePost(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $postId = (int)$request->getRouteParam(0);
        $text = $request->getBody()["text"];

        if (strlen($text) > 5000) {
            return $this->json(
                $this->badRequest("Title cannot be longer than 5000 symbols")
            );
        }

        $res = $this->postRepository->GetPost($userId, $postId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Post not found")
            );
        }

        if($res->UserId != $userId){
            return $this->json(
                $this->badRequest("Permission denied")
            );
        }

        $this->postRepository->UpdatePost($postId, $text);

        return $this->json($this->ok());
    }

    #[Authorize]
    #[Delete("{id}")]
    public function DeletePost(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $userRole = $this->UserClaim("role");
        $postId = (int)$request->getRouteParam(0);


        $res = $this->postRepository->GetPost($userId, $postId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Post not found")
            );
        }

        if($res->UserId != $userId && $userRole != "Administrator" && $userRole != "Moderator"){
            return $this->json(
                $this->badRequest("Permission denied")
            );
        }

        $this->postRepository->DeletePost($postId);

        return $this->json($this->ok());
    }

    #[Authorize]
    #[POST("like/{id}")]
    public function LikePost(Request $request): Response
    {
        $userId = $this->UserClaim("id", 0);
        $postId = (int)$request->getRouteParam(0);

        $this->postRepository->LikePost($userId, $postId);

        return $this->json($this->ok());
    }
}