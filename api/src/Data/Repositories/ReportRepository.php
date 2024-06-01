<?php

namespace App\Data\Repositories;

use App\Models\Report;
use Core\Database\DbSet;
use Core\Database\QueryBuilder\QueryBuilder;
use PDO;

class ReportRepository
{
    private DbSet $reports;

    public function __construct()
    {
        $this->reports = new DbSet('report', Report::class);
    }


    public function GetReport(int $reportId)
    {
        return $this->reports->get()
            ->where("Id", "=", "" , $reportId, PDO::PARAM_STR)
            ->execute()[0];
    }


    public function GetReports(string $userTimestamp, int $limit, int $offset, string $orderBy, string $order) : array
    {
        return $this->reports->get()
            ->where("DateCreated", "<", "" , $userTimestamp, PDO::PARAM_STR)
            ->orderBy($orderBy, $order)
            ->limit($limit, $offset)
            ->execute();
    }

    public function AddReport(Report $report): void
    {
        $this->reports->insert($report);
    }

    public function DeleteReport(Report $report): void
    {
        $this->reports->delete($report);
    }
}