import { ajax } from "rxjs/internal/ajax/ajax";
import { catchError, delay, map, merge, mergeMap, Observable, of, throwError, timer } from "rxjs";
import { redirect } from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "../Helpers/CookieHelper";
import { wait } from "@testing-library/user-event/dist/utils";
import { Credentials } from "../Types/Credentials";
import { getAccount, setLogInError } from "../Redux/Reducers/AccountReducer";
import { User } from "../Types/User";

const loginurl = "https://localhost:7295/graphql-login";

const url = "https://localhost:7295/graphql";

export type TokenType = {
  issued_at: Date,
  value: string
  expires_at: Date,
}

export type LoginType = {
  data: {
    login: {
      user_Id: string,
      access_Token: TokenType,
      refresh_Token: TokenType,
    }
  }
  errors: [
    {
      message: string
    }
  ]
}


export function LoginRequest(credentials: Credentials) {
  return ajax<LoginType>({
    url: loginurl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query($Input: LoginInput!){
          login(input: $Input){
            access_Token {
              issued_at
              value
              expires_at
            }
            user_Id
            refresh_Token {
              issued_at
              value
              expires_at
            }
          }
        }`,
      variables: {
        "Input": {
          "username_Or_Email": credentials.loginOrEmail,
          "password": credentials.password
        }
      }
    }),
    withCredentials: true,
  }).pipe(
    map((value) => {

      if (value.response.errors) {
        throw new Error(value.response.errors[0].message);
      }
      let fullResponse = value.response;
      let response = fullResponse.data.login;

      setCookie({
        name: "access_token",
        value: JSON.stringify(response.access_Token),
        expires_second: (new Date(response.access_Token.expires_at).getTime() - new Date(response.access_Token.issued_at).getTime()) / 1000,
        path: "/"
      });
      setCookie({
        name: "user_id",
        value: response.user_Id,
        expires_second: (new Date(response.access_Token.expires_at).getTime() - new Date(response.access_Token.issued_at).getTime()) / 1000,
        path: "/"
      });
      setCookie({
        name: "refresh_token",
        value: JSON.stringify(response.refresh_Token),
        expires_second: (new Date(response.refresh_Token.expires_at).getTime() - new Date(response.refresh_Token.issued_at).getTime()) / 1000,
        path: "/"
      });
    }),
    catchError((error) => {
      throw error
    })
  );
}

export function RefreshTokenRequest(variables: {}) {
  const refreshToken: TokenType = JSON.parse(getCookie("refresh_token")!);
  return ajax<LoginType>({
    url: loginurl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      refresh_token: refreshToken.value,
    },
    body: JSON.stringify({
      query: `query{
        login: refreshToken{
          access_Token {
            issued_at
            value
            expires_at
          }
          user_Id
          refresh_Token {
            issued_at
            value
            expires_at
          }
        }
      }`,
      variables
    }),
    withCredentials: true,
  }).pipe(
    delay(1000),
    map((value): string => {
      if (value.response.errors) {

        throw new Error(value.response.errors[0].message);
      }

      let response = value.response.data.login;
      setCookie({
        name: "access_token",
        value: JSON.stringify(response.access_Token),
        expires_second: (new Date(response.access_Token.expires_at).getTime() - new Date(response.access_Token.issued_at).getTime()) / 1000,
        path: "/"
      });
      setCookie({
        name: "user_id",
        value: response.user_Id,
        expires_second: (new Date(response.access_Token.expires_at).getTime() - new Date(response.access_Token.issued_at).getTime()) / 1000,
        path: "/"
      });
      setCookie({
        name: "refresh_token",
        value: JSON.stringify(response.refresh_Token),
        expires_second: (new Date(response.refresh_Token.expires_at).getTime() - new Date(response.refresh_Token.issued_at).getTime()) / 1000,
        path: "/"
      });
      setCookie({ name: "refresh_sent", value: "false" })

      return "/";
    }),
    catchError((error) => {
      throw error
    })
  );
}

export function LogoutRequest() {
  const refreshToken: TokenType = JSON.parse(getCookie("refresh_token")!);
  return ajax({
    url: loginurl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      refresh_token: refreshToken.value,
    },
    body: JSON.stringify({
      query: `query{
        logout
      }`,
    }),
    withCredentials: true,
  }).pipe(
    map((res: any): void => {

      if (res.response.errors) {
        throw "error"
      }

      Logout()

      return res;
    }),
    catchError((error) => {
      throw error
    })
  );
}

const Logout = () => {
  deleteCookie("refresh_token");
  deleteCookie("access_token");
  deleteCookie("user_id");
  deleteCookie("canUseUserIp");
  setCookie({ name: "refresh_sent", value: "false" })
  getAccount({} as User);
}

export type response<T = any> = {
  data: T,
  errors?: any
}

export function GetAjaxObservable<T>(query: string, variables: {}, authorized = true, withCredentials = false, requestUrl = url, forGraphql = true) {
  if (isSigned()) {
    var refreshObservable = of('/');
    if (CheckRefresh()) {
      const refreshSentString = getCookie("refresh_sent");
      const refreshSent: boolean = refreshSentString ? JSON.parse(refreshSentString) : refreshSentString
      if (!refreshSent) {
        setCookie({ name: "refresh_sent", value: "true" })
        refreshObservable = RefreshTokenRequest({});
      }
      else {
        refreshObservable = new Observable<string>((subscriber) => {
          const sub = timer(10, 20).subscribe({
            next: () => {
              let refreshSentString = getCookie("refresh_sent");
              let isTokenSent: boolean = refreshSentString ? JSON.parse(refreshSentString) : refreshSentString
              if (!isTokenSent) {
                subscriber.next()
                sub.unsubscribe()
              }
            }
          })
        })
      }
    }
    return refreshObservable.pipe(
      catchError(error => {
        setLogInError(error.message)
        if (error.message == "Invalid token") {
          Logout();
        }
        return throwError(() => new Error(error.message));
      }),
      mergeMap(() => {
        let token: TokenType = {} as TokenType;
        try {
          token = JSON.parse(getCookie("access_token")!)
        }
        catch {
          return throwError(() => new Error("Invalid token"));
        }
        if (token === null) return throwError(() => new Error("Invalid token"));
        return ajax<response<T>>({
          url: requestUrl,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.value,
          },
          body: JSON.stringify({
            query,
            variables
          }),
          withCredentials: withCredentials
        })
      })
    )
  }
  if (!authorized) {
    return ajax<response<T>>({
      url: requestUrl,
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
      withCredentials: withCredentials
    })
  }
  return throwError(() => {
    return new Error("Not signed in");
  }
  )
}

function CheckRefresh(): boolean {
  const accessTokenString = getCookie("access_token");
  if (!accessTokenString) return true;
  const accessToken = JSON.parse(accessTokenString!);
  const timespan = (new Date(accessToken.expires_at).getTime() - new Date().getTime()) / 1000;
  return timespan < 10;
}


export function isSigned(): boolean {
  const refreshTokenString = getCookie("refresh_token");
  const refreshToken: boolean = refreshTokenString ? JSON.parse(refreshTokenString) : refreshTokenString
  return !!refreshToken;
}