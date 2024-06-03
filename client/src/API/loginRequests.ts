import { catchError, map, throwError } from "rxjs";
import { ajax } from "rxjs/internal/ajax/ajax";
import { deleteCookie, getCookie, setCookie } from "../Helpers/CookieHelper";
import { getAccount } from "../Redux/Reducers/AccountReducer";
import { Credentials } from "../Types/Credentials";
import { User } from "../Types/User";
import { GetAjaxObservable } from "./APIUtils";

export type LoginType = {
  token: string,
  expires: Date,
  issued: Date
}


export function LoginRequest(credentials: Credentials) {
  return GetAjaxObservable<LoginType>(`/account/login`, "POST", false, {'Content-Type': 'application/json'}, true, {
    'usernameOrEmail': credentials.loginOrEmail,
    'password': credentials.password
  }).pipe(
    map((value) => {
      setCookie({
        name: "access_token",
        value: JSON.stringify(value.response.data.token),
        expires_second: (new Date(value.response.data.expires).getTime() - new Date(value.response.data.issued).getTime()) / 1000,
        path: "/"
      });
    })
  );
}

export const Logout = () => {
  deleteCookie("access_token");
  getAccount({} as User);
}

export function isSigned(): boolean {
  const accessToken = getCookie("access_token");
  return !!accessToken;
}