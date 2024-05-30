<?php

namespace App\Controllers;

use App\Data\Repositories\UserRepository;
use App\Identity\JwtManager;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Auth\Attributes\Requires;
use Core\Controller\Attributes\Delete;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Patch;
use Core\Controller\Attributes\Route;
use Core\Controller\Controller;
use Core\Http\Request;
use Core\Http\Response;
use DateTime;

#[Route("users")]
class UserController extends Controller
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
    }

    #[Anonymous]
    #[Get("search")]
    public function GetUsersBySearch(Request $request): Response
    {
        $userTimestamp = $request->getQueryParams()["usertimestamp"] ??  date('d-m-y h:i:s');
        $userTimestamp = (new DateTime($userTimestamp))->format('d-m-y h:i:s');

        $orderBy = $request->getQueryParams()["orderby"] ?? "Posts";
        $skip = (int)$request->getQueryParams()["skip"] ?? 0;
        $take = (int)$request->getQueryParams()["take"] ?? 10;
        $search = $request->getQueryParams()["search"] ?? '';

        return $this->json(
            $this->ok(
                $this->userRepository->GetUsersBySearch($search, $userTimestamp, $take, $skip, $orderBy, 'DESC')
            )
        );
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

    #[Authorize]
    #[Get("")]
    public function GetUser(Request $request): Response
    {
        $userId = $request->getQueryParams()["userId"];

        $res = $this->userRepository->GetUserById($userId);

        if ($res == null) {
            return $this->json(
                $this->notFound("User not found")
            );
        }

        return $this->json($this->ok($res));
    }

    #[Authorize]
    #[Requires("role", "Administrator")]
    #[Patch("role")]
    public function UpdateUserRole(Request $request): Response
    {
        $userId = $request->getBody()["userId"];
        $roleId = $request->getBody()["roleId"];

        $this->userRepository->UpdateUserRole($userId, $roleId);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Requires("role", "Administrator")]
    #[Delete("")]
    public function DeleteUser(Request $request): Response
    {
        $userId = $this->UserClaim("id");

        $deleteUserId = (int)$request->getQueryParams()["userid"];
        $password = $request->getQueryParams()["password"];
        error_log($deleteUserId);

        if(!password_verify($password, $this->userRepository->GetUserPassword($userId))){
            return $this->json(
                $this->badRequest("Wrong password")
            );
        }

        $this->userRepository->DeleteUser($deleteUserId);

        return $this->json(
            $this->ok()
        );
    }
}