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

    public function GetPosts(int $userId, string $userTimestamp, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT p.Id AS Id,
                    p.Title AS Title, 
                    p.Text AS Text, 
                    p.DateCreated AS DateCreated, 
                    p.DateEdited AS DateEdited,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    Count(DISTINCT pl.userId) AS Likes,
                    Count(DISTINCT c.Id) + Count(DISTINCT r.Id) AS Comments,
                    EXISTS (SELECT * FROM post_like WHERE post_like.PostId = p.Id AND UserId = :UserId) AS Liked
                    FROM post p
                    INNER JOIN user u ON u.Id = p.UserId
                    LEFT JOIN post_like pl ON pl.postId = p.Id
                    LEFT JOIN comment c ON c.PostId = p.Id 
                    LEFT JOIN Reply r ON r.CommentId = c.Id       
                    WHERE p.DateCreated < :UserTimestamp
                    GROUP BY p.Id
                    ORDER BY $orderBy $order
                    LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("UserTimestamp", $userTimestamp, PDO::PARAM_STR)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Post::class);
    }

    public function GetUserPosts(int $userId, string $userTimestamp, string $username, int $limit, int $offset, string $orderBy, string $order): array
    {
        $query = "SELECT p.Id AS Id,
                    p.Title AS Title, 
                    p.Text AS Text, 
                    p.DateCreated AS DateCreated, 
                    p.DateEdited AS DateEdited,
                    u.Id AS UserId, 
                    u.Username AS UserUsername,
                    Count(DISTINCT pl.userId) AS Likes,
                    Count(DISTINCT c.Id) + Count(DISTINCT r.Id) AS Comments,
                    EXISTS (SELECT * FROM post_like WHERE post_like.PostId = p.Id AND UserId = :UserId) AS Liked
                    FROM post p
                    INNER JOIN user u ON u.Id = p.UserId
                    LEFT JOIN post_like pl ON pl.postId = p.Id
                    LEFT JOIN comment c ON c.PostId = p.Id 
                    LEFT JOIN Reply r ON r.CommentId = c.Id 
                    WHERE u.Username = :Username && p.DateCreated < :UserTimestamp
                    GROUP BY p.Id
                    ORDER BY $orderBy $order
                    LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("UserTimestamp", $userTimestamp, PDO::PARAM_STR)
            ->setParameter("Username", $username, PDO::PARAM_STR)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Post::class);
    }

    public function GetPost(int $userId, int $postId): ?Post
    {
        $query = "SELECT p.Id as Id,
                    p.Title as Title, 
                    p.Text as Text, 
                    p.DateCreated as DateCreated, 
                    p.DateEdited as DateEdited,
                    u.Id as UserId, 
                    u.Username as UserUsername,
                    Count(DISTINCT pl.userId) as Likes,
                    Count(DISTINCT c.Id) + Count(DISTINCT r.Id) as Comments,
                    EXISTS (SELECT * FROM post_like WHERE post_like.PostId = p.Id AND UserId = :UserId) AS Liked
                    FROM post p
                    INNER JOIN user u ON u.Id = p.UserId
                    LEFT JOIN post_like pl ON pl.postId = p.Id
                    LEFT JOIN comment c ON c.PostId = p.Id 
                    LEFT JOIN Reply r ON r.CommentId = c.Id
                    WHERE p.Id = :PostId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->fetchFirst(Post::class);
    }

    public function AddPost(int $userId, string $title, ?string $text): bool
    {
        $query = "INSERT INTO post (title, text, userId) VALUES (:Title, :Text, :UserId)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Title", $title, PDO::PARAM_STR)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->setParameter("UserId", $userId, PDO::PARAM_INT)
            ->execute();
    }

    public function UpdatePost(int $postId, string $text): bool
    {
        $query = "UPDATE post set Text = :Text WHERE Id = :PostId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("PostId", $postId, PDO::PARAM_STR)
            ->setParameter("Text", $text, PDO::PARAM_STR)
            ->execute();
    }

    public function DeletePost(int $postId): bool
    {
        $query = "Delete FROM post WHERE Id = :PostId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->execute();
    }
}