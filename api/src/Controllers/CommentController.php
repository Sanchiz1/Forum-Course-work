<?php

namespace App\Controllers;

use App\Data\Repositories\CommentRepository;
use App\Data\Repositories\PostRepository;
use Core\Auth\Attributes\Anonymous;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("comments")]
class CommentController extends Controller
{
    private CommentRepository $commentRepository;
    public function __construct()
    {
        $this->commentRepository = new CommentRepository();
    }

    #[Anonymous]
    #[Get("")]
    public function GetPostComments(Request $request): Response
    {
        $postId = (int)$request->getQueryParams()["postid"];
        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->commentRepository->GetPostComment($userId, $postId, $take, $skip, $orderBy, 'DESC')
            )
        );
    }
}