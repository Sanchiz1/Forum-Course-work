import { catchError, map } from "rxjs";
import { Reply, ReplyInput } from "../Types/Reply";
import { GetAjaxObservable } from "./APIUtils";

export function requestReplies(commentId: Number, offset: Number, next: Number, order: String, userTimestamp: Date) {
    return GetAjaxObservable<Reply[]>(`/replies?userTimestamp=${userTimestamp.toISOString()}&commentId=${commentId}&take=${next}&skip=${offset}`, "GET", false, { 'Content-Type': 'application/json' }, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function createReplyRequest(ReplyInput: ReplyInput) {
    return GetAjaxObservable(`/replies`, "POST", true, { 'Content-Type': 'application/json' }, true, ReplyInput).pipe(
        map(() => {
            return "Relpy created successfully";
        })
    );
}

export function updateReplyRequest(text: String, id: Number) {
    return GetAjaxObservable(`/replies/${id}`, "PATCH", true, { 'Content-Type': 'application/json' }, true, { text: text }).pipe(
        map(() => {
            return "Reply updated successfully";
        })
    );
}

export function deleteReplyRequest(id: Number) {
    return GetAjaxObservable(`/replies/${id}`, "DELETE", true, { 'Content-Type': 'application/json' }, true).pipe(
        map(() => {
            return "Reply deleted successfully";
        })
    );
}

export function likeReplyRequest(id: Number) {
    return GetAjaxObservable(`/replies/like/${id}`, "POST", true, { 'Content-Type': 'application/json' }, true);
}