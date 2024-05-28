export interface User {
    Id: number,
    Username: string,
    Email: string,
    Bio?: string,
    DateRegistered: Date,
    Posts: number
    Comments: number
    RoleId: number
    Role: string
}
export interface UserRegistration {
    id: number,
    username: string,
    email: string,
    bio: string,
    password: string
}

export interface UserInput {
    username: string,
    email: string,
    bio?: string,
    password?: string
}