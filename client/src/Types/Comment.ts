export interface Comment{
    id: Number,
    text: string,
    date_Created: Date,
    date_Edited?: Date,
    post_Id: Number
    user_Id: Number
    user_Username: string,
    likes: Number,
    replies: Number,
    liked: boolean
}

export interface CommentInput {
    post_Id: Number,
    text: string
}