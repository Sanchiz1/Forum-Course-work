<?php

namespace App\Data\Repositories;

use App\Models\Post;
use Core\Database\ColumnsMapper;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class PostRepository
{
    private QueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->queryBuilder = new QueryBuilder();
    }

    public function GetPosts(int $userId, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT p.Id AS Id,
                    p.Title AS Title, 
                    p.Text AS Text, 
                    p.DateCreated AS DateCreated, 
                    p.DateEdited AS DateEdited,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    Count(DISTINCT pl.userId) AS Likes,
                    Count(DISTINCT c.Id) + Count(DISTINCT r.Id) AS Comments
                    FROM post p
                    INNER JOIN user u ON u.Id = p.UserId
                    LEFT JOIN post_like pl ON pl.postId = p.Id
                    LEFT JOIN comment c ON c.PostId = p.Id 
                    LEFT JOIN Reply r ON r.CommentId = c.Id       
                    GROUP BY p.Id
                    ORDER BY $orderBy $order
                    LIMIT :offset, :limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("offset", $offset, PDO::PARAM_INT)
            ->setParameter("limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Post::class);
    }

    public function GetPost(int $postId, int $userId): Post
    {
        $query = "SELECT p.Id as Id,
                    p.Title as Title, 
                    p.Text as Text, 
                    p.DateCreated as DateCreated, 
                    p.DateEdited as DateEdited,
                    u.Id as UserId, 
                    u.Username as UserUsername,
                    Count(DISTINCT pl.userId) as Likes,
                    Count(DISTINCT c.Id) + Count(DISTINCT r.Id) as Comments
                    FROM post p
                    INNER JOIN user u ON u.Id = p.UserId
                    LEFT JOIN post_like pl ON pl.postId = p.Id
                    LEFT JOIN comment c ON c.PostId = p.Id 
                    LEFT JOIN Reply r ON r.CommentId = c.Id";

        return $this->queryBuilder
            ->custom($query)
            ->fetchFirst(Post::class);
    }

    public function AddPost(int $userId, string $title, ?string $text): bool
    {
        $query = "INSERT INTO post (title, text, userId) VALUES (:Title, :Text, :UserId)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Title", $title, PDO::PARAM_STR)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->setParameter("UserId", $userId, PDO::PARAM_STR)
            ->execute();
    }
}