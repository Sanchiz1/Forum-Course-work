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

interface GraphqlLikeReply {
    reply: {
        likeReply: string
    }
}

export function likeReplyRequest(id: Number) {
    return GetAjaxObservable<GraphqlLikeReply>(`
        mutation($Input: LikeReplyInput!){
            reply{
              likeReply(input: $Input)
            }
          }`,
        {
            "Input": {
                "reply_Id": id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.reply.likeReply;

        }),
        catchError((error) => {
            throw error
        })
    );
}