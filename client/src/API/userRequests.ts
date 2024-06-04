import { catchError, map, of } from "rxjs";
import { User, UserInput } from "../Types/User";
import { GetAjaxObservable } from "./APIUtils";
import NotFoundError from "../Types/NotFoundError";

const url = "https://localhost:8000";

interface GraphqlSearchedUser {
    users: {
        searchedUsers: User[]
    }
}

export function requestUsers(offset: Number, next: Number, userTimestamp: Date, orderBy: string, order: string) {
    return GetAjaxObservable<User[]>(`/users?userTimestamp=${userTimestamp.toISOString()}&take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestSearchedUsers(offset: Number, next: Number, userTimestamp: Date, search: string, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<User[]>(`/users/search?search=${search}&userTimestamp=${userTimestamp.toISOString()}&take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestUserById(id: Number) {
    return GetAjaxObservable<User>(`/users/${id}`, "GET", false, {'Content-Type': 'application/json'}, true).pipe(
        map((value) => {
            return value.response.data; 
        }),
        catchError((error) => {
            if(error instanceof NotFoundError){
                return of(null);
            }

            throw error
        })
    );
}

export function requestUserByUsername(username: string) {
    return GetAjaxObservable<User>(`/users/${username}`, "GET", false, {'Content-Type': 'application/json'}, true).pipe(
        map((response) => {
            return response.response.data;
        }),
        catchError((error) => {
            if(error instanceof NotFoundError){
                return of(null);
            }

            throw error
        })
    );
}

export function requestAccount() {
    return GetAjaxObservable<User>(`/account`, "GET", true, {'Content-Type': 'application/json'}, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function createUserRequest(UserInput: UserInput) {
    return GetAjaxObservable(`/account/register`, "POST", false, {'Content-Type': 'application/json'}, true, UserInput).pipe(
        map(() => {
            return "User created successfully";
        })
    );
}

export function updateUserRequest(UserInput: UserInput) {
    return GetAjaxObservable(`/account`, "PATCH", true, {'Content-Type': 'application/json'}, true, UserInput).pipe(
        map(() => {
            return "User updated successfully";
        })
    );
}

export function updateUserRoleRequest(userId: number, roleId: number) {
    return GetAjaxObservable(`/users/role`, "PATCH", true, {'Content-Type': 'application/json'}, true, {userId: userId, roleId: roleId}).pipe(
        map(() => {
            return "User updated successfully";
        })
    );
}

export function changeUserPasswordRequest(password: string, newPassword: string) {
    return GetAjaxObservable(`/account/password`, "PATCH", true, {'Content-Type': 'application/json'}, true, {password: password, newPassword: newPassword}).pipe(
        map(() => {
            return "Password updated successfully";
        })
    );
}

export function DeleteAccountRequest(userId: number, password: string) {
    return GetAjaxObservable(`/account?userId=${userId}&password=${password}`, "DELETE", true, {'Content-Type': 'application/json'}, true).pipe(
        map(() => {
            return "Account deleted successfully";
        })
    );
}

export function DeleteUserRequest(userId: number, password: string) {
    return GetAjaxObservable(`/users?userId=${userId}&password=${password}`, "DELETE", true, {'Content-Type': 'application/json'}, true).pipe(
        map(() => {
            return "User deleted successfully";
        })
    );
}

export function requestUploadUserAvatar(formData: FormData) {
    console.log(formData);
    return GetAjaxObservable(`/account/avatar`, "POST", true, {}, true, formData).pipe(
        map(() => {
            return "Avatar changed successfully";
        })
    );
}

export function requestDeleteUserAvatar() {
    return GetAjaxObservable(`/account/avatar`, "DELETE", true, {}, true).pipe(
        map(() => {
            return "Avatar deleted successfully";
        })
    );
}