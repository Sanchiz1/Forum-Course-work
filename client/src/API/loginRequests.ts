import { catchError, map, throwError } from "rxjs";
import { ajax } from "rxjs/internal/ajax/ajax";
import { deleteCookie, getCookie, setCookie } from "../Helpers/CookieHelper";
import { getAccount } from "../Redux/Reducers/AccountReducer";
import { Credentials } from "../Types/Credentials";
import { User } from "../Types/User";

const url = "http://localhost:8000";

export type TokenType = {
  issued_at: Date,
  value: string
  expires_at: Date,
}

export type LoginType = {
  data: {
    token: string,
    expires: Date,
    issued: Date
  }
  error: string
}


export function LoginRequest(credentials: Credentials) {
  return ajax<LoginType>({
    url: `${url}/account/login`,
    method: 'POST',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      'usernameOrEmail': credentials.loginOrEmail,
      'password': credentials.password
    }
  }).pipe(
    map((value) => {
      setCookie({
        name: "access_token",
        value: JSON.stringify(value.response.data.token),
        expires_second: (new Date(value.response.data.expires).getTime() - new Date(value.response.data.issued).getTime()) / 1000,
        path: "/"
      });
    }),
    catchError((error) => {
      throw new Error(error.response.error)
    })
  );
}

export const Logout = () => {
  deleteCookie("access_token");
  getAccount({} as User);
}

export type response<T = any> = {
  data: T,
  error?: string
}

export function GetAjaxObservable<T>(requestUrl: string, method: string, needsAuth: boolean, withCredentials: boolean = false, body: any = null) {

  let headers = {
    'Content-Type': 'application/json'
  }

  if (needsAuth || isSigned()) {

    let token = getCookie("access_token")!;

    if (token === null) return throwError(() => new Error("Invalid token"));

    headers = { ...headers, ...{ 'Authorization': 'Bearer ' + token } };
  }

  return ajax<response<T>>({
    url: url + requestUrl,
    method: method,
    headers: headers,
    body: body,
    withCredentials: withCredentials
  }).pipe(
    catchError((error) => {

      if (error.status == 401) {
        Logout();
      }

      throw new Error(error.response.error)
    }))
}

export function isSigned(): boolean {
  const accessToken = getCookie("access_token");
  return !!accessToken;
}