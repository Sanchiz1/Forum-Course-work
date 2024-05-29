import { catchError, map } from "rxjs";
import { Reply, ReplyInput } from "../Types/Reply";
import { GetAjaxObservable } from "./loginRequests";

export function requestReplies(commentId: Number, offset: Number, next: Number, order: String, userTimestamp: Date) {
    return GetAjaxObservable<Reply[]>(`/replies?userTimestamp=${userTimestamp.toISOString()}&commentId=${commentId}&take=${next}&skip=${offset}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function createReplyRequest(ReplyInput: ReplyInput) {
    return GetAjaxObservable(`/replies`, "POST", true, true, ReplyInput).pipe(
        map(() => {
            return "Relpy created successfully";
        })
    );
}

export function updateReplyRequest(text: String, id: Number) {
    return GetAjaxObservable(`/replies/${id}`, "PATCH", true, true, {text: text}).pipe(
        map(() => {
            return "Reply updated successfully";
        })
    );
}

export function deleteReplyRequest(id: Number) {
    return GetAjaxObservable(`/replies/${id}`, "DELETE", true, true).pipe(
        map(() => {
            return "Reply deleted successfully";
        })
    );
}

export function likeReplyRequest(id: Number) {
    return GetAjaxObservable(`/replies/like/${id}`, "POST", true, true);
}