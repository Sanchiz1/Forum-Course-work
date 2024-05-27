import { ajax } from "rxjs/internal/ajax/ajax";
import { catchError, delay, map, merge, mergeMap, Observable, of, throwError, timer } from "rxjs";
import { redirect } from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "../Helpers/CookieHelper";
import { wait } from "@testing-library/user-event/dist/utils";
import { Credentials } from "../Types/Credentials";
import { getAccount, setLogInError } from "../Redux/Reducers/AccountReducer";
import { User } from "../Types/User";
import { tokenToString } from "typescript";

const loginurl = "http://localhost:8000/graphql-login";

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
  errors?: any
}

export function GetAjaxObservable<T>(requestUrl: string, method: string, needsAuth: boolean, withCredentials = false, body = null) {

  let headers = {
    'Content-Type': 'application/json'
  }

  if (needsAuth || isSigned()) {
    let token: TokenType = {} as TokenType;

    let tokenString = getCookie("access_token")!;

    if (tokenString === null) return throwError(() => new Error("Invalid token"));

    token = JSON.parse(tokenString);

    headers = { ...headers, ...{ 'Authorization': 'Bearer ' + token.value } };
  }

  return ajax<response<T>>({
    url: url + requestUrl,
    method: method,
    headers: headers,
    body: body,
    withCredentials: withCredentials
  })
}

export function isSigned(): boolean {
  const accessTokenString = getCookie("access_token");
  const accessToken: boolean = accessTokenString ? JSON.parse(accessTokenString) : accessTokenString
  return !!accessTokenString;
}