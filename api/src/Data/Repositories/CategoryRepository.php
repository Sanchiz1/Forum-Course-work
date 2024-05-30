<?php

namespace App\Data\Repositories;

use App\Models\Category;
use App\Models\Comment;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class CategoryRepository
{
    private QueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->queryBuilder = new QueryBuilder();
    }

    public function GetAllCategories() : array
    {
        $query = "SELECT c.Id AS Id, 
                    c.Title AS Title
                    FROM category c";

        return $this->queryBuilder
            ->custom($query)
            ->fetchAll(Category::class);
    }

    public function GetCategories(int $limit, int $offset) : array
    {
        $query = "SELECT c.Id AS Id,
                    c.Title AS Title
                    FROM category c
                    LIMIT :Offset, :Limit";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Offset", $offset, PDO::PARAM_INT)
            ->setParameter("Limit", $limit, PDO::PARAM_INT)
            ->fetchAll(Category::class);
    }

    public function GetPostCategories($postId) : array
    {
        $query = "SELECT c.Id AS Id, 
                    c.Title AS Title
                    FROM post_category pc
                    INNER JOIN category c ON c.Id = pc.CategoryId
                    WHERE pc.PostId = :PostId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->fetchAll(Category::class);
    }


    public function AddCategory(string $title): bool
    {
        $query = "INSERT INTO category (Title) VALUES(:Title)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Title", $title, PDO::PARAM_STR)
            ->execute();
    }

    public function UpdateCategory(int $categoryId, string $title): bool
    {
        $query = "UPDATE category SET Title = :Title WHERE Id = :CategoryId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("CategoryId", $categoryId, PDO::PARAM_INT)
            ->setParameter("Title", $title, PDO::PARAM_STR)
            ->execute();
    }

    public function DeleteCategory(int $categoryId): bool
    {
        $query = "Delete FROM category WHERE Id = :CategoryId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("CategoryId", $categoryId, PDO::PARAM_INT)
            ->execute();
    }

    public function AddPostCategory($postId, $categoryId) : array
    {
        $query = "INSERT INTO post_category (PostId, CategoryId) VALUES (:PostId, :CategoryId)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->setParameter("CategoryId", $categoryId, PDO::PARAM_INT)
            ->fetchAll(Category::class);
    }

    public function RemovePostCategory($postId, $categoryId) : array
    {
        $query = "DELETE FROM post_category WHERE PostId = :PostId and CategoryId = :CategoryId";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("PostId", $postId, PDO::PARAM_INT)
            ->setParameter("CategoryId", $categoryId, PDO::PARAM_INT)
            ->fetchAll(Category::class);
    }
}