import { catchError, map } from "rxjs";
import { Comment, CommentInput } from "../Types/Comment";
import { GetAjaxObservable } from "./loginRequests";

const url = "https://localhost:7295/graphql";

interface GraphqlMonthlyPosts {
    statistics: {
        getMonthlyPosts: number[]
    }
}

export function requestMonthlyPosts(year: number) {
    return GetAjaxObservable<GraphqlMonthlyPosts>(
        `query($Input:  GetMonthlyPostsInput!){
                statistics{
                    getMonthlyPosts(input: $Input)
                }
            }`,
        {
            "Input": {
                "year": year,
            }
        },
        false).pipe(
            map((value) => {
                return value.response.data.statistics.getMonthlyPosts;
            }),
            catchError((error) => {
                throw error
            })
        );
}

interface GraphqlMonthlyUsers {
    statistics: {
        getMonthlyUsers: number[]
    }
}

export function requestMonthlyUsers(year: number) {
    return GetAjaxObservable<GraphqlMonthlyUsers>(
        `query($Input:  GetMonthlyUsersInput!){
                statistics{
                    getMonthlyUsers(input: $Input)
                }
            }`,
        {
            "Input": {
                "year": year,
            }
        },
        false).pipe(
            map((value) => {
                return value.response.data.statistics.getMonthlyUsers;
            }),
            catchError((error) => {
                throw error
            })
        );
}