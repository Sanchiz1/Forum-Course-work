<?php

namespace App\Controllers;

use App\Data\Repositories\CommentRepository;
use App\Data\Repositories\PostRepository;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Controller\Attributes\Delete;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Patch;
use Core\Controller\Attributes\Post;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;
use DateTime;

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
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $userTimestamp = (new DateTime($userTimestamp))->format('d-m-y h:i:s');

        $postId = (int)$request->getQueryParams()["postid"];
        $orderBy = $request->getQueryParams()["orderby"] ?? "likes";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->commentRepository->GetPostComments($userId, $userTimestamp, $postId, $take, $skip, $orderBy, 'DESC')
            )
        );
    }

    #[Anonymous]
    #[Get("{id}")]
    public function GetCommentById(Request $request): Response
    {
        $commentId = (int)$request->getRouteParam(0);

        $userId = $this->UserClaim("id", 0);

        $res = $this->commentRepository->GetCommentById($userId, $commentId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Post not found")
            );
        }
        return $this->json($this->ok($res));
    }

    #[Authorize]
    #[Post("")]
    public function AddComment(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $postId = $request->getBody()["postId"];
        $text = $request->getBody()["text"];

        $res = $this->commentRepository->AddComment($userId, $postId, $text);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Patch("{id}")]
    public function UpdatePost(Request $request): Response
    {
        $commentId = (int)$request->getRouteParam(0);
        $text = $request->getBody()["text"];

        $this->commentRepository->UpdateComment($commentId, $text);

        return $this->json($this->ok());
    }

    #[Authorize]
    #[Delete("{id}")]
    public function DeletePost(Request $request): Response
    {
        $commentId = (int)$request->getRouteParam(0);

        $this->commentRepository->DeleteComment($commentId);

        return $this->json($this->ok());
    }
}