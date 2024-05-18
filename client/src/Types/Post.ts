import { Category } from "./Category"

export interface Post{
    id: Number,
    title: string,
    text?: string,
    date_Created: Date,
    date_Edited?: Date,
    user_Id: Number,
    categories: Category[],
    user_Username: string,
    likes: Number,
    comments: Number,
    liked: boolean
}

export interface PostInput {
    title: string,
    text?: string
}