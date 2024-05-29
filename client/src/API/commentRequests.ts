import { catchError, map } from "rxjs";
import { Comment, CommentInput } from "../Types/Comment";
import { GetAjaxObservable } from "./loginRequests";


export function requestComments(postId: Number, offset: Number, next: Number, order: String, userTimestamp: Date) {
    return GetAjaxObservable<Comment[]>(`/comments?userTimestamp=${userTimestamp.toISOString()}&postId=${postId}&take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestCommentById(id: number) {
    return GetAjaxObservable<Comment>(`/comments/${id}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function createCommentRequest(CommentInput: CommentInput) {
    return GetAjaxObservable(`/comments`, "POST", true, true, CommentInput).pipe(
        map(() => {
            return "Comment created successfully";
        })
    );
}

export function updateCommentRequest(text: String, id: Number) {
    return GetAjaxObservable(`/comments/${id}`, "PATCH", true, true, {text: text}).pipe(
        map(() => {
            return "Comment updated successfully";
        })
    );
}

export function deleteCommentRequest(id: Number) {
    return GetAjaxObservable(`/comments/${id}`, "DELETE", true, true).pipe(
        map(() => {
            return "Comment deleted successfully";
        })
    );
}

export function likeCommentRequest(id: Number) {
    return GetAjaxObservable<GraphqlLikeComment>(`
        mutation($Input: LikeCommentInput!){
            comment{
              likeComment(input: $Input)
            }
          }`,
        {
            "Input": {
                "comment_Id": id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.comment.likeComment;

        }),
        catchError((error) => {
            throw error
        })
    );
}
