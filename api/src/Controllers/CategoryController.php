<?php

namespace App\Controllers;

use App\Data\Repositories\CategoryRepository;
use App\Data\Repositories\PostRepository;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Auth\Attributes\Requires;
use Core\Controller\Attributes\Delete;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Patch;
use Core\Controller\Attributes\Post;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("categories")]
class CategoryController extends Controller
{
    private PostRepository $postRepository;
    private CategoryRepository $categoryRepository;

    public function __construct()
    {
        $this->categoryRepository = new CategoryRepository();
        $this->postRepository = new PostRepository();
    }

    #[Anonymous]
    #[Get("all")]
    public function GetAllCategories(Request $request): Response
    {
        return $this->json(
            $this->ok(
                $this->categoryRepository->GetAllCategories()
            )
        );
    }

    #[Anonymous]
    #[Get("")]
    public function GetCategories(Request $request): Response
    {
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        return $this->json(
            $this->ok(
                $this->categoryRepository->GetCategories($take, $skip)
            )
        );
    }

    #[Anonymous]
    #[Get("post")]
    public function GetPostCategories(Request $request): Response
    {
        $postId = (int)$request->getQueryParams()["postid"] ?? 0;

        return $this->json(
            $this->ok(
                $this->categoryRepository->GetPostCategories($postId)
            )
        );
    }

    #[Authorize]
    #[Requires("role", ["Administrator"])]
    #[Post("")]
    public function AddCategory(Request $request): Response
    {
        $title = $request->getBody()["title"];

        if ($title == null) {
            return $this->json(
                $this->badRequest("Title was not set")
            );
        }

        if (strlen($title) > 100) {
            return $this->json(
                $this->badRequest("Title cannot be longer than 100 symbols")
            );
        }

        $this->categoryRepository->AddCategory($title);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Requires("role", ["Administrator"])]
    #[Patch("{id}")]
    public function UpdateCategory(Request $request): Response
    {
        $categoryId = (int)$request->getRouteParam(0);
        $title = $request->getBody()["title"];

        if ($title == null) {
            return $this->json(
                $this->badRequest("Title was not set")
            );
        }

        if (strlen($title) > 100) {
            return $this->json(
                $this->badRequest("Title cannot be longer than 100 symbols")
            );
        }

        $this->categoryRepository->UpdateCategory($categoryId, $title);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Requires("role", ["Administrator"])]
    #[Delete("{id}")]
    public function DeleteCategory(Request $request): Response
    {
        $categoryId = (int)$request->getRouteParam(0);

        $this->categoryRepository->DeleteCategory($categoryId);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Post("post/{id}")]
    public function AddPostCategory(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $userRole = $this->UserClaim("role");
        $postId = (int)$request->getRouteParam(0);
        $categoryId = (int)$request->getQueryParams()["categoryid"];

        $res = $this->postRepository->GetPost($userId, $postId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Post not found")
            );
        }

        if ($res->UserId != $userId && $userRole != "Administrator" && $userRole != "Moderator") {
            return $this->json(
                $this->badRequest("Permission denied")
            );
        }

        $this->categoryRepository->AddPostCategory($postId, $categoryId);

        return $this->json(
            $this->ok()
        );
    }

    #[Anonymous]
    #[Delete("post/{id}")]
    public function RemovePostCategory(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $userRole = $this->UserClaim("role");
        $postId = (int)$request->getRouteParam(0);
        $categoryId = (int)$request->getQueryParams()["categoryid"];

        $res = $this->postRepository->GetPost($userId, $postId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Post not found")
            );
        }

        if ($res->UserId != $userId && $userRole != "Administrator" && $userRole != "Moderator") {
            return $this->json(
                $this->badRequest("Permission denied")
            );
        }

        $this->categoryRepository->RemovePostCategory($postId, $categoryId);

        return $this->json(
            $this->ok()
        );
    }
}