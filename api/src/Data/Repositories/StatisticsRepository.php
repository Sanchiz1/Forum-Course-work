<?php

namespace App\Data\Repositories;

use App\Models\Post;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class StatisticsRepository
{
    private QueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->queryBuilder = new QueryBuilder();
    }

    public function GetMonthlyUsers(int $year) : array
    {
        $query = "CALL monthly_users(:Year)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Year", $year, PDO::PARAM_INT)
            ->fetchColumn();
    }

    public function GetMonthlyPosts(int $year) : array
    {
        $query = "CALL monthly_posts(:Year)";

        return $this->queryBuilder
            ->custom($query)
            ->setParameter("Year", $year, PDO::PARAM_INT)
            ->fetchColumn();
    }
}