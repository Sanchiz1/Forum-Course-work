import { ajax } from "rxjs/internal/ajax/ajax";
import { catchError, delay, map } from "rxjs";
import { Comment, CommentInput } from "../Types/Comment";
import { GetAjaxObservable } from "./loginRequests";

const url = "https://localhost:7295/graphql";

interface GraphqlComments {
    comments: {
        comments: Comment[]
    }
}

export function requestComments(post_Id: Number, offset: Number, next: Number, order: String, user_timestamp: Date) {
    return GetAjaxObservable<GraphqlComments>(
        `query($Input:  GetCommentsInput!){
                comments{
                    comments(input: $Input){
                        id
                        text
                        date_Created
                        date_Edited
                        post_Id
                        user_Id
                        user_Username
                        likes
                        replies
                        liked
                    }
                }
            }`,
        {
            "Input": {
                "post_Id": post_Id,
                "offset": offset,
                "next": next,
                "order": order,
                "user_Timestamp": user_timestamp.toISOString()
            }
        },
        false).pipe(
            map((value) => {
                return value.response.data.comments.comments;
            }),
            catchError((error) => {
                throw error
            })
        );
}

interface GraphqlCommentById {
    comments: {
        comment: Comment
    }
}

export function requestCommentById(id: number) {
    return GetAjaxObservable<GraphqlCommentById>(
        `query($Input:  GetCommentByIdInput!){
                comments{
                    comment(input: $Input){
                        id
                        text
                        date_Created
                        date_Edited
                        post_Id
                        user_Id
                        user_Username
                        likes
                        replies
                        liked
                    }
                }
            }`,
        {
            "Input": {
                "id": id
            }
        },
        false).pipe(
            map((value) => {
                return value.response.data.comments.comment;
            }),
            catchError((error) => {
                throw error
            })
        );
}

interface GraphqlCreateComment {
    comment: {
        createComment: string
    }
}

export function createCommentRequest(CommentInput: CommentInput) {
    return GetAjaxObservable<GraphqlCreateComment>(`
        mutation($Input: CreateCommentInput!){
            comment{
              createComment(input: $Input)
            }
          }`,
        {
            "Input": {
                "post_Id": CommentInput.post_Id,
                "text": CommentInput.text,
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.comment.createComment;

        }),
        catchError((error) => {
            throw error
        })
    );
}


interface GraphqlUpdateComment {
    comment: {
        updateComment: string
    }
}

export function updateCommentRequest(text: String, id: Number) {
    return GetAjaxObservable<GraphqlUpdateComment>(`
        mutation($Input: UpdateCommentInput!){
            comment{
              updateComment(input: $Input)
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

            return value.response.data.comment.updateComment;

        }),
        catchError((error) => {
            throw error
        })
    );
}


interface GraphqlDeleteComment {
    comment: {
        deleteComment: string
    }
}

export function deleteCommentRequest(id: Number) {
    return GetAjaxObservable<GraphqlDeleteComment>(`
        mutation($Input: DeleteCommentInput!){
            comment{
              deleteComment(input: $Input)
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

            return value.response.data.comment.deleteComment;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlLikeComment {
    comment: {
        likeComment: string
    }
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
