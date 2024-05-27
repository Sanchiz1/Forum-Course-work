import { catchError, map } from "rxjs";
import { Reply, ReplyInput } from "../Types/Reply";
import { GetAjaxObservable } from "./loginRequests";

interface GraphqlReplies {
    replies: {
        replies: Reply[]
    }
}

export function requestReplies(comment_id: Number, offset: Number, next: Number, order: String, user_timestamp: Date) {
    return GetAjaxObservable<GraphqlReplies>(
        `query($Input:  GetRepliesInput!){
                replies{
                    replies(input: $Input){
                        id
                        text
                        date_Created
                        date_Edited
                        comment_Id
                        reply_User_Id
                        user_Id
                        user_Username
                        reply_Username
                        likes
                        liked
                    }
                }
            }`,
        {
            "Input": {
                "comment_Id": comment_id,
                "offset": offset,
                "next": next,
                "order": order,
                "user_Timestamp": user_timestamp.toISOString()
            }
        }, false).pipe(
            map((value) => {
                return value.response.data.replies.replies;
            }),
            catchError((error) => {
                throw error
            })
        );
}

interface GraphqlCreateReply {
    reply: {
        createReply: string
    }
}

export function createReplyRequest(ReplyInput: ReplyInput) {
    return GetAjaxObservable<GraphqlCreateReply>(`
        mutation($Input: CreateReplyInput!){
            reply{
              createReply(input: $Input)
            }
          }`,
        {
            "Input": {
                "comment_Id": ReplyInput.comment_Id,
                "text": ReplyInput.text,
                "reply_User_Id": ReplyInput.reply_User_Id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.reply.createReply;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlUpdateReply {
    reply: {
        updateReply: string
    }
}

export function updateReplyRequest(text: String, id: Number) {
    return GetAjaxObservable<GraphqlUpdateReply>(
        `mutation($Input: UpdateReplyInput!){
            reply{
              updateReply(input: $Input)
            }
          }`,
        {
            "Input": {
                "text": text,
                "id": id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.reply.updateReply;

        }),
        catchError((error) => {
            throw error
        })
    );
}


interface GraphqlDeleteReply {
    reply: {
        deleteReply: string
    }
}

export function deleteReplyRequest(id: Number) {
    return GetAjaxObservable<GraphqlDeleteReply>(`
        mutation($Input: DeleteReplyInput!){
            reply{
              deleteReply(input: $Input)
            }
          }`,
        {
            "Input": {
                "id": id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.reply.deleteReply;

        }),
        catchError((error) => {
            throw error
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