<?php

namespace App\Controllers;

use App\Data\Repositories\UserRepository;
use App\Identity\JwtManager;
use Core\Auth\Attributes\Anonymous;
use Core\Auth\Attributes\Authorize;
use Core\Controller\Attributes\Delete;
use Core\Controller\Attributes\Get;
use Core\Controller\Attributes\Patch;
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

    #[Anonymous]
    #[Post("login")]
    public function Login(Request $request): Response
    {
        $usernameOrEmail = $request->getBody()["usernameOrEmail"];
        $password = $request->getBody()["password"];

        $user = $this->userRepository->GetUserUsernameOrEmail($usernameOrEmail);

        if ($user == null) {
            return $this->json(
                $this->badRequest("Wrong email or password")
            );
        }

        $userPassword = $this->userRepository->GetUserPassword($user->Id);

        if (!password_verify($password, $userPassword)) {
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

        $usernameCheck = $this->userRepository->GetUserByUsername($username);

        if ($usernameCheck != null) {
            return $this->json(
                $this->badRequest("User with this Username already exists")
            );
        }

        $emailCheck = $this->userRepository->GetUserByEmail($email);

        if ($emailCheck != null) {
            return $this->json(
                $this->badRequest("User with this Email already exists")
            );
        }

        $password = password_hash($password, PASSWORD_DEFAULT);
        $this->userRepository->AddUser($username, $email, null, $password);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Patch("")]
    public function UpdateAccount(Request $request): Response
    {
        $userId = $this->UserClaim("id");

        $username = $request->getBody()["username"];
        $email = $request->getBody()["email"];
        $bio = $request->getBody()["bio"];

        $usernameCheck = $this->userRepository->GetUserByUsername($username);

        if ($usernameCheck != null && $usernameCheck->Id != $userId) {
            return $this->json(
                $this->badRequest("User with this Username already exists")
            );
        }

        $emailCheck = $this->userRepository->GetUserByEmail($email);

        if ($emailCheck != null && $emailCheck->Id != $userId) {
            return $this->json(
                $this->badRequest("User with this Email already exists")
            );
        }

        $this->userRepository->UpdateUser($userId, $username, $email, $bio);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Post("avatar")]
    public function UploadAccountAvatar(Request $request): Response
    {
        $files = $request->getFiles();
        $userId = $this->UserClaim("id");

        if (!isset($files['file'])) {
            return $this->json(
                $this->badRequest("No file provided")
            );
        }

        $file = $files['file'];

        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if($fileExtension == 'jpg'){
            $image = imagecreatefromjpeg($file['tmp_name']);
        }
        else if($fileExtension == 'png') {
            $image = imagecreatefrompng($file['tmp_name']);
        }
        else if($fileExtension == 'webp') {
            $image = imagecreatefromwebp($file['tmp_name']);
        }
        else{
            return $this->json(
                $this->badRequest("Unsupported file extension")
            );
        }

        $imgResized = imagescale($image, 512, 512);

        $uploadDir = 'avatars/';

        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                return $this->json(
                    $this->badRequest("Failed to upload image")
                );
            }
        }

        $fileName = $userId . '.png';
        $uploadFile = $uploadDir . $fileName;

        if (!imagepng($imgResized, $uploadFile)) {
            return $this->json(
                $this->badRequest("Failed to upload image")
            );
        }

        imagedestroy($image);
        imagedestroy($imgResized);

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Delete("avatar")]
    public function DeleteAccountAvatar(Request $request): Response
    {
        $userId = $this->UserClaim("id");

        $uploadDir = 'avatars/';

        $fileName = $userId . '.png';
        $deleteFile = $uploadDir . $fileName;

        if (!unlink($deleteFile)) {
            return $this->json(
                $this->badRequest("Failed to delete avatar")
            );
        }

        return $this->json(
            $this->ok()
        );
    }

    #[Authorize]
    #[Patch("password")]
    public function UpdateAccountPassword(Request $request): Response
    {
        $userId = $this->UserClaim("id");

        $password = $request->getBody()["password"];
        $newPassword = $request->getBody()["newPassword"];

        if (!password_verify($password, $this->userRepository->GetUserPassword($userId))) {
            return $this->json(
                $this->badRequest("Wrong password")
            );
        }

        $this->userRepository->UpdateUserPassword($userId, password_hash($newPassword, PASSWORD_DEFAULT));


        return $this->json(
            $this->ok()
        );
    }


    #[Authorize]
    #[Delete("")]
    public function DeleteAccount(Request $request): Response
    {
        $userId = $this->UserClaim("id");

        $password = $request->getQueryParams()["password"];

        if (crypt($password, PASSWORD_DEFAULT) != $this->userRepository->GetUserPassword($userId)) {
            return $this->json(
                $this->badRequest("Wrong password")
            );
        }

        $this->userRepository->DeleteUser($userId);

        return $this->json(
            $this->ok()
        );
    }
}