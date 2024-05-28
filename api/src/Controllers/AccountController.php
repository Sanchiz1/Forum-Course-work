<?php

namespace App\Controllers;

use App\Data\Repositories\UserRepository;
use App\Identity\JwtManager;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
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

    #[Anonymous]
    #[Post("register")]
    public function Register(Request $request): Response
    {
        $username = $request->getBody()["username"];
        $email = $request->getBody()["email"];
        $password = $request->getBody()["password"];

        $res = $this->userRepository->AddUser($username, $email, null, $password);

        if ($res == null) {
            return $this->json(
                $this->badRequest("Failed to create user")
            );
        }

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Get("")]
    public function GetAccount(Request $request): Response
    {
        $userId = $this->UserClaim("id");

        return $this->json(
            $this->ok(
                $this->userRepository->GetUserById($userId)
            )
        );
    }
}