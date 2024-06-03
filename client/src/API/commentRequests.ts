import { catchError, map } from "rxjs";
import { Comment, CommentInput } from "../Types/Comment";
import { GetAjaxObservable } from "./APIUtils";


export function requestComments(postId: Number, offset: Number, next: Number, order: String, userTimestamp: Date) {
    return GetAjaxObservable<Comment[]>(`/comments?userTimestamp=${userTimestamp.toISOString()}&postId=${postId}&take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, {'Content-Type': 'application/json'},true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestCommentById(id: number) {
    return GetAjaxObservable<Comment>(`/comments/${id}`, "GET", false, {'Content-Type': 'application/json'},true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function createCommentRequest(CommentInput: CommentInput) {
    return GetAjaxObservable(`/comments`, "POST", true, {'Content-Type': 'application/json'},true, CommentInput).pipe(
        map(() => {
            return "Comment created successfully";
        })
    );
}

export function updateCommentRequest(text: String, id: Number) {
    return GetAjaxObservable(`/comments/${id}`, "PATCH", true, {'Content-Type': 'application/json'},true, {text: text}).pipe(
        map(() => {
            return "Comment updated successfully";
        })
    );
}

export function deleteCommentRequest(id: Number) {
    return GetAjaxObservable(`/comments/${id}`, "DELETE", true, {'Content-Type': 'application/json'},true).pipe(
        map(() => {
            return "Comment deleted successfully";
        })
    );
}

export function likeCommentRequest(id: Number) {
    
    return GetAjaxObservable(`/comments/like/${id}`, "POST", true, {'Content-Type': 'application/json'},true);
}
