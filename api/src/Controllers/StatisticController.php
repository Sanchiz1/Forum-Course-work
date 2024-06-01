<?php

namespace App\Controllers;

use App\Data\Repositories\StatisticsRepository;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Requires;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Requires("role", "Administrator")]
#[Route("statistics")]
class StatisticController extends Controller
{
    private StatisticsRepository $statisticsRepository;

    public function __construct()
    {
        $this->statisticsRepository = new StatisticsRepository();
    }

    #[Get("users")]
    public function GetMonthlyUsers(Request $request) : Response
    {
        $year = (int)$request->getQueryParam("year", date("Y"));

        $users = $this->statisticsRepository->GetMonthlyUsers($year);

        return $this->json(
            $this->ok($users)
        );
    }

    #[Get("posts")]
    public function GetMonthlyPosts(Request $request) : Response
    {
        $year = (int)$request->getQueryParam("year", date("Y"));

        $users = $this->statisticsRepository->GetMonthlyPosts($year);

        return $this->json(
            $this->ok($users)
        );
    }
}