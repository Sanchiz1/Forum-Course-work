<?php

namespace App\Controllers;

use App\Data\Repositories\UserRepository;
use App\Identity\JwtManager;
use Core\Auth\Attributes\Anonymous;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("users")]
class UserController extends Controller
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
    }

    #[Anonymous]
    #[Get("{username}")]
    public function GetUserByUsername(Request $request) : Response
    {
        $username = $request->getRouteParam(0);

        $user = $this->userRepository->GetUserByUsername($username);

        if ($user == null) {
            return $this->json(
                $this->notFound("User not found")
            );
        }

        return $this->json(
            $this->ok($user)
        );
    }
}