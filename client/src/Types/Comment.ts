export interface Comment{
    Id: number,
    Text: string,
    DateCreated: Date,
    DateEdited?: Date,
    PostId: number,
    UserId: number,
    UserUsername: string,
    Likes: number,
    Replies: number,
    Liked: boolean
}

export interface CommentInput {
    postId: number,
    text: string
}