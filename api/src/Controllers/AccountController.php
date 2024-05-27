<?php

namespace App\Controllers;

use App\Data\Repositories\UserRepository;
use App\Identity\JwtManager;
use Core\Auth\Attributes\Anonymous;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Post;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;

#[Route("account")]
class AccountController extends Controller
{
    private UserRepository $userRepository;
    private JwtManager $jwtManager;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
        $this->jwtManager = new JwtManager();
    }

    #[Anonymous]
    #[Post("login")]
    public function Login(Request $request): Response
    {
        $usernameOrEmail = $request->getBody()["usernameOrEmail"];
        $password = $request->getBody()["password"];

        $user = $this->userRepository->GetUserByCredentials($usernameOrEmail, $password);

        if ($user == null) {
            return $this->json(
                $this->badRequest("Wrong email or password")
            );
        }

        $token = $this->jwtManager->encodeToken(["id" => $user->Id, "role" => $user->Role]);
        return $this->json(
            $this->ok($token)
        );
    }
}