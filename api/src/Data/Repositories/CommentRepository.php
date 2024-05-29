<?php

namespace App\Data\Repositories;

use App\Models\Comment;
use App\Models\Post;
use Core\Database\ColumnsMapper;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class CommentRepository
{
    private QueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->queryBuilder = new QueryBuilder();
    }

    public function GetPostComments(int $userId, string $userTimestamp, int $postId, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT c.Id AS Id, 
                    c.Text AS Text,
                    c.DateCreated AS DateCreated, 
                    c.DateEdited AS DateEdited,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    Count(DISTINCT cl.UserId) AS Likes,
                    Count(DISTINCT r.Id) AS Replies,
                    EXISTS (SELECT * FROM comment_like WHERE comment_like.CommentId = c.Id AND UserId = :UserId) AS Liked
                    FROM comment c
                    INNER JOIN user u ON u.Id = c.UserId
                    LEFT JOIN comment_like cl ON cl.CommentId = c.Id
                    LEFT JOIN reply r ON r.CommentId = c.Id
                    WHERE c.DateCreated < :UserTimestamp AND c.postId = :PostId   
                    GROUP BY c.Id
                    ORDER BY $orderBy $order
                    LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->setParameter("UserTimestamp", $userTimestamp, PDO::PARAM_STR)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Comment::class);
    }

    public function GetCommentById(int $userId, int $commentId): ?Comment
    {
        $query = "SELECT c.Id AS Id, 
                    c.Text AS Text,
                    c.DateCreated AS DateCreated, 
                    c.DateEdited AS DateEdited,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    Count(DISTINCT cl.UserId) AS Likes,
                    Count(DISTINCT r.Id) AS Replies,
                    EXISTS (SELECT * FROM comment_like WHERE comment_like.CommentId = c.Id AND UserId = :UserId) AS Liked
                    FROM comment c
                    INNER JOIN user u ON u.Id = c.UserId
                    LEFT JOIN comment_like cl ON cl.CommentId = c.Id
                    LEFT JOIN reply r ON r.CommentId = c.Id
                    WHERE c.Id = :CommentId   
                    GROUP BY c.Id";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("CommentId", $commentId, PDO::PARAM_INT)
            ->fetchFirst(Comment::class);
    }

    public function AddComment(int $userId, int $postId, ?string $text): bool
    {
        $query = "INSERT INTO comment (Text, UserId, PostId) VALUES(:Text, :UserId, :PostId)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->execute();
    }

    public function UpdateComment(int $commentId, string $text): bool
    {
        $query = "UPDATE comment SET Text = :Text WHERE Id = :CommentId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("CommentId", $commentId, PDO::PARAM_INT)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->execute();
    }

    public function DeleteComment(int $commentId): bool
    {
        $query = "Delete FROM comment WHERE Id = :CommentId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("CommentId", $commentId, PDO::PARAM_INT)
            ->execute();
    }

    public function LikeComment(int $userId, int $commentId): bool
    {
        $query = "CALL toggle_comment_like(:CommentId, :UserId);";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("CommentId", $commentId, PDO::PARAM_INT)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->execute();
    }
}