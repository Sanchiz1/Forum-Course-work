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

    public function GetPostComment(int $userId, int $postId, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT c.Id AS Id, 
                    c.Text AS Text, 
                    c.DateCreated AS DateCreated, 
                    c.DateEdited AS DateEdited,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    Count(DISTINCT cl.userId) AS Likes,
                    Count(DISTINCT r.Id) AS Replies
                    FROM comment c
                    INNER JOIN user u ON u.Id = c.UserId
                    LEFT JOIN comment_like cl ON cl.commentId = c.Id
                    LEFT JOIN reply r ON r.CommentId = c.Id
                    WHERE c.postId = :PostId   
                    GROUP BY c.Id
                    ORDER BY $orderBy $order
                    LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Comment::class);
    }
}