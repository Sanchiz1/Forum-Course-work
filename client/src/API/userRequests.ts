import { ajax } from "rxjs/internal/ajax/ajax";
import { catchError, delay, map, mergeMap, Observable, of, timer } from "rxjs";
import { redirect } from "react-router-dom";
import { GetAjaxObservable, TokenType } from "./loginRequests";
import { getCookie } from "../Helpers/CookieHelper";
import { User, UserInput } from "../Types/User";

const url = "https://localhost:7295/graphql";

interface GraphqlSearchedUser {
    users: {
        searchedUsers: User[]
    }
}

export function requestUsers(offset: Number, next: Number, user_timestamp: Date, search: string) {
    return GetAjaxObservable<GraphqlSearchedUser>(`
    query($Input:  GetSearchedUsersInput!){
        users{
            searchedUsers(input: $Input){
                id
                username
                email
                bio
                registered_At
                posts
                comments
                role
                role_Id
        }
      }
    }`,
        {
            "Input": {
                "offset": offset,
                "next": next,
                "user_Timestamp": user_timestamp.toISOString(),
                "search": search
            }
        },
        false).pipe(
            map((value) => {
                return value.response.data.users.searchedUsers;
            }),
            catchError((error) => {
                throw error
            })
        );
}

interface GraphqlUser {
    users: {
        user: User
    }
}

export function requestUserById(id: Number) {
    return GetAjaxObservable<GraphqlUser>(`
    query($Input:  GetRepliesInput!){
        user:userById(input: $Input){
          id
          username
          email
          bio
          registered_At
          posts
          comments
          role
          role_Id
      }
    }`, {
        "Input": {
            "id": id
        }
    }
    ).pipe(
        map(res => {
            return res.response.data.users.user;
        }),
        catchError((error) => {
            throw error;
        })
    );
}

export function requestUserByUsername(usernaame: string) {
    return GetAjaxObservable<GraphqlUser>(`
    query($Input:  GetUserByUsernameInput!){
        users{
            user:userByUsername(input: $Input){
            id
            username
            email
            bio
            registered_At
            posts
            comments
            role
            role_Id
            }
        }
    }`, {
        "Input": {
            "username": usernaame
        }
    },
        false
    ).pipe(
        map(res => {
            return res.response.data.users.user;
        }),
        catchError((error) => {
            throw error;
        })
    );
}

export function requestAccount() {
    return GetAjaxObservable<GraphqlUser>(`query{
        users{
            user:account{
                id
                username
                email
                bio
                registered_At
                role
                role_Id
        }
      }
    }`, {}).pipe(
        map(res => {
            return res.response.data.users.user;
        }),
        catchError((error) => {
            throw error;
        })
    );
}

interface GraphqlCreateUser {
    data: {
        user: {
            createUser: string
        }
    }
    errors: [
        {
            message: string
        }
    ]
}

export function createUserRequest(UserInput: UserInput) {
    return ajax<GraphqlCreateUser>({
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `
        mutation($Input: CreateUserInput!){
            user{
              createUser(input: $Input)
            }
          }`,
            variables: {
                "Input": {
                    "username": UserInput.username,
                    "email": UserInput.email,
                    "password": UserInput.password
                }
            }
        }),
        withCredentials: true,
    }).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.user.createUser;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlUpdateUser {
    user: {
        user: string
    }
}

export function updateUserRequest(UserInput: UserInput) {
    return GetAjaxObservable<GraphqlUpdateUser>(`
        mutation($Input: UpdateUserInput!){
            user{
              user:updateUser(input: $Input)
            }
          }`,
        {
            "Input": {
                "username": UserInput.username,
                "email": UserInput.email,
                "bio": UserInput.bio
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.user.user;

        }),
        catchError((error) => {
            throw error
        })
    );
}

export function updateUserRoleRequest(user_id: number, role_id: number | null) {
    return GetAjaxObservable<GraphqlUpdateUser>(`
        mutation($Input: UpdateUserRoleInput!){
            user{
                user:updateUserRole(input: $Input)
            }
          }`,
        {
            "Input": {
                "user_Id": user_id,
                "role_Id": role_id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.user.user;

        }),
        catchError((error) => {
            throw error
        })
    );
}

export function changeUserPasswordRequest(user_id: number, password: string, new_password: string) {
    return GetAjaxObservable<GraphqlUpdateUser>(`
        mutation($Input: ChangeUserPasswordInput!){
            user{
                user:changeUserPassword(input: $Input)
            }
          }`,
        {
            "Input": {
                "account_Id": user_id,
                "password": password,
                "new_Password": new_password,
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.user.user;

        }),
        catchError((error) => {
            throw error
        })
    );
}

export function DeleteUserRequest(user_id: number, password?: string) {
    return GetAjaxObservable<GraphqlUpdateUser>(`
        mutation($Input: DeleteUserInput!){
            user{
                user:deleteUser(input: $Input)
            }
          }`,
        {
            "Input": {
                "user_Id": user_id,
                "password": password
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.user.user;

        }),
        catchError((error) => {
            throw error
        })
    );
}