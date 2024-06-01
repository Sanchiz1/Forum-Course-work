import { catchError, map } from "rxjs";
import { GetAjaxObservable } from "./APIUtils";

export function requestMonthlyPosts(year: number) {
    return GetAjaxObservable<number[]>(`/statistics/posts?year=${year}`, "GET", true, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestMonthlyUsers(year: number) {
    return GetAjaxObservable<number[]>(`/statistics/users?year=${year}`, "GET", true, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}