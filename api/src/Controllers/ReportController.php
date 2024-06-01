<?php

namespace App\Controllers;

use App\Data\Repositories\ReportRepository;
use App\Models\Report;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Auth\Attributes\Requires;
use Core\Controller\Attributes\Delete;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Post;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("reports")]
class ReportController extends Controller
{
    private ReportRepository $reportRepository;

    public function __construct()
    {
        $this->reportRepository = new ReportRepository();
    }

    #[Anonymous]
    #[Requires("role", ["Administrator", "Moderator"])]
    #[Get("")]
    public function GetReports(Request $request): Response
    {
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ?? date('d-m-y h:i:s');
        $userTimestamp = date("yy-m-d h:i:s", strtotime($userTimestamp));

        $orderBy = $request->getQueryParams()["orderby"] ?? "DateCreated";
        $order = $request->getQueryParams()["order"] ?? "ASC";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;

        return $this->json(
            $this->ok(
                $this->reportRepository->GetReports($userTimestamp, $take, $skip, $orderBy, $order)
            )
        );
    }

    #[Authorize]
    #[Post("")]
    public function AddReport(Request $request): Response
    {
        $postId = $request->getBody()["postId"];
        $text = $request->getBody()["text"];

        if($text == null) {
            return $this->json($this->badRequest("Text not set"));
        }

        if($postId == null) {
            return $this->json($this->badRequest("Post not set"));
        }

        $report = new Report();

        $report->Text = $text;
        $report->PostId = $postId;

        $this->reportRepository->AddReport($report);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Requires("role", ["Administrator", "Moderator"])]
    #[Delete("{id}")]
    public function DeleteReport(Request $request): Response
    {
        $reportId = (int)$request->getRouteParam(0);

        $report = $this->reportRepository->GetReport($reportId);

        if($report == null){
            return $this->json(
                $this->badRequest("Report not found")
            );
        }

        $this->reportRepository->DeleteReport($report);

        return $this->json(
            $this->ok()
        );
    }
}