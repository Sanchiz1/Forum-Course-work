export interface Post{
    Id: Number,
    Title: string,
    Text?: string,
    DateCreated: Date,
    DateEdited?: Date,
    UserId: number,
    UserUsername: string,
    Likes: number,
    Comments: number,
    Liked: boolean
}

export interface PostInput {
    title: string,
    text?: string
}