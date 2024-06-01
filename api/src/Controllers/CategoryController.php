<?php

namespace App\Controllers;

use App\Data\Repositories\CategoryRepository;
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
    private CategoryRepository $categoryRepository;
    public function __construct()
    {
        $this->categoryRepository = new CategoryRepository();
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

        $this->categoryRepository->UpdateCategory($categoryId ,$title);

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

    #[Anonymous]
    #[Post("post/{id}")]
    public function AddPostCategory(Request $request): Response
    {
        $postId = (int)$request->getRouteParam(0);
        $categoryId = (int)$request->getQueryParams()["categoryid"];

        $this->categoryRepository->AddPostCategory($postId, $categoryId);

        return $this->json(
            $this->ok()
        );
    }

    #[Anonymous]
    #[Delete("post/{id}")]
    public function RemovePostCategory(Request $request): Response
    {
        $postId = (int)$request->getRouteParam(0);
        $categoryId = (int)$request->getQueryParams()["categoryid"];

        $this->categoryRepository->RemovePostCategory($postId, $categoryId);

        return $this->json(
            $this->ok()
        );
    }
}