export interface Reply{
    Id: number,
    Text: string,
    DateCreated: Date,
    DateEdited?: Date,
    CommentId: number,
    ToUserId: number
    UserId: number,
    UserUsername: string,
    ToUserUsername: string
    Likes: number,
    Liked: boolean
}
export interface ReplyInput {
    text: string,
    commentId: number,
    toUserId?: number,
}