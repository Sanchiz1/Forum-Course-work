<?php

namespace App\Controllers;

use App\Data\Repositories\ReplyRepository;
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

#[Route("replies")]
class ReplyController extends Controller
{
    private ReplyRepository $replyRepository;
    public function __construct()
    {
        $this->replyRepository = new ReplyRepository();
    }

    #[Anonymous]
    #[Get("")]
    public function GetCommentReplies(Request $request): Response
    {
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $userTimestamp = date("yy-m-d h:i:s", strtotime($userTimestamp));

        $commentId = (int)$request->getQueryParams()["commentid"];
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        $userId = $this->UserClaim("id", 0);

        return $this->json(
            $this->ok(
                $this->replyRepository->GetCommentReplies($userId, $userTimestamp, $commentId, $take, $skip, "DateCreated", 'ASC')
            )
        );
    }

    #[Authorize]
    #[Post("")]
    public function AddReply(Request $request): Response
    {
        $userId = $this->UserClaim("id");
        $toUserId = $request->getBody()["toUserId"];
        $commentId = $request->getBody()["commentId"];
        $text = $request->getBody()["text"];

        $res = $this->replyRepository->AddReply($userId, $toUserId, $commentId, $text);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Patch("{id}")]
    public function UpdateReply(Request $request): Response
    {
        $replyId = (int)$request->getRouteParam(0);
        $text = $request->getBody()["text"];

        $userId = $this->UserClaim("id");

        $res = $this->replyRepository->GetReplyById($userId, $replyId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Reply not found")
            );
        }

        if($res->UserId != $userId){
            return $this->json(
                $this->badRequest("Permission denied")
            );
        }

        $this->replyRepository->UpdateReply($replyId, $text);

        return $this->json($this->ok());
    }

    #[Authorize]
    #[Delete("{id}")]
    public function DeleteReply(Request $request): Response
    {
        $replyId = (int)$request->getRouteParam(0);

        $userId = $this->UserClaim("id");
        $userRole = $this->UserClaim("role");

        $res = $this->replyRepository->GetReplyById($userId, $replyId);

        if ($res == null) {
            return $this->json(
                $this->notFound("Reply not found")
            );
        }

        if($res->UserId != $userId && $userRole != "Administrator" && $userRole != "Moderator"){
            return $this->json(
                $this->badRequest("Permission denied")
            );
        }

        $this->replyRepository->DeleteReply($replyId);

        return $this->json($this->ok());
    }

    #[Authorize]
    #[POST("like/{id}")]
    public function LikeReply(Request $request): Response
    {
        $userId = $this->UserClaim("id", 0);
        $replyId = (int)$request->getRouteParam(0);

        $this->replyRepository->LikeReply($userId, $replyId);

        return $this->json($this->ok());
    }
}