export interface Reply{
    id: Number,
    text: string,
    date_Created: Date,
    date_Edited?: Date,
    comment_Id: Number,
    reply_User_Id: Number
    user_Id: Number,
    user_Username: string,
    reply_Username: string
    likes: Number,
    liked: boolean
}
export interface ReplyInput {
    text: string,
    comment_Id: Number,
    reply_User_Id?: Number,
}