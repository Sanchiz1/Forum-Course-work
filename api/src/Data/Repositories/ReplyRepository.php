<?php

namespace App\Data\Repositories;

use App\Models\Comment;
use App\Models\Reply;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class ReplyRepository
{
    private QueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->queryBuilder = new QueryBuilder();
    }

    public function GetCommentReplies(int $userId, string $userTimestamp, int $commentId, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT r.Id AS Id, 
                    r.Text AS Text,
                    r.DateCreated AS DateCreated, 
                    r.DateEdited AS DateEdited,
                    r.CommentId AS CommentId,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    tu.Id AS ToUserId, 
                    tu.Username AS ToUserUsername,
                    Count(DISTINCT rl.UserId) AS Likes,
                    EXISTS (SELECT * FROM reply_like WHERE reply_like.ReplyId = r.Id AND UserId = :UserId) AS Liked
                    FROM reply r
                    INNER JOIN user u ON u.Id = r.UserId
                    LEFT JOIN user tu ON tu.Id = r.ToUserId
                    LEFT JOIN reply_like rl ON rl.ReplyId = r.Id
                    WHERE r.DateCreated < :UserTimestamp AND r.CommentId = :CommentId   
                    GROUP BY r.Id
                    ORDER BY $orderBy $order
                    LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("CommentId", $commentId, PDO::PARAM_INT)
            ->setParameter("UserTimestamp", $userTimestamp, PDO::PARAM_STR)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Reply::class);
    }


    public function AddReply(int $userId, ?int $toUserId, int $commentId, ?string $text): bool
    {
        $query = "INSERT INTO reply (Text, UserId, ToUserId, CommentId) VALUES(:Text, :UserId, :ToUserId, :CommentId)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("ToUserId", $toUserId, PDO::PARAM_INT)
            ->setParameter("CommentId", $commentId, PDO::PARAM_INT)
            ->execute();
    }

    public function UpdateReply(int $replyId, string $text): bool
    {
        $query = "UPDATE reply SET Text = :Text WHERE Id = :ReplyId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("ReplyId", $replyId, PDO::PARAM_INT)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->execute();
    }

    public function DeleteReply(int $replyId): bool
    {
        $query = "Delete FROM reply WHERE Id = :ReplyId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("ReplyId", $replyId, PDO::PARAM_INT)
            ->execute();
    }

    public function LikeReply(int $userId, int $replyId): bool
    {
        $query = "CALL toggle_reply_like(:ReplyId, :UserId);";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("ReplyId", $replyId, PDO::PARAM_INT)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->execute();
    }
}