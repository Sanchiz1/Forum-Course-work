import { catchError, map } from "rxjs";
import { Post, PostInput } from "../Types/Post";
import { GetAjaxObservable } from "./loginRequests";

export function requestPosts(offset: Number, next: Number, order: String, user_timestamp: Date, categories?: number[]) {
    return GetAjaxObservable<Post[]>(`/posts?take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        }),
        catchError((error) => {
            throw error
        })
    );
}

export function requestSearchedPosts(offset: Number, next: Number, user_timestamp: Date, search: string) {
    return GetAjaxObservable<GraphqlPosts>(
        `query($Input: GetSearchedPostsInput!){
              posts{
                posts:searchedPosts(input: $Input){
                    id
                    title
                    text
                    date_Created
                    date_Edited
                    user_Id
                    user_Username
                    likes
                    comments
                    liked
                }
              }
            }`,
        {
            "Input": {
                "offset": offset,
                "next": next,
                "user_Timestamp": user_timestamp.toISOString(),
                "search": search
            }
        },
        false
    ).pipe(
        map((value) => {
            return value.response.data.posts.posts;
        }),
        catchError((error) => {
            throw error
        })
    );
}

export function requestUserPosts(author_username: String, offset: Number, next: Number, order: String, user_timestamp: Date) {
    return GetAjaxObservable<GraphqlPosts>(
        `query($Input: GetUserPostsInput!){
              posts{
                posts:userPosts(input: $Input){
                    id
                    title
                    text
                    date_Created
                    date_Edited
                    user_Id
                    user_Username
                    likes
                    comments
                    liked
                }
              }
            }`,
        {
            "Input": {
                "author_Username": author_username,
                "offset": offset,
                "next": next,
                "order": order,
                "user_Timestamp": user_timestamp.toISOString()
            }
        },
        false
    ).pipe(
        map((value) => {
            return value.response.data.posts.posts;
        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlPost {
    posts: {
        post: Post
    }
}

export function requestPostById(id: Number) {
    return GetAjaxObservable<GraphqlPost>(
        `query($Input:  GetPostByIdInput!){
              posts{
                post(input: $Input){
                    id
                    title
                    text
                    date_Created
                    date_Edited
                    user_Id
                    categories{
                        id,
                        title
                    }
                    user_Username
                    likes
                    comments
                    liked
                }
              }
            }`
        ,
        {
            "Input": {
                "id": id
            }
        },
        false
    ).pipe(
        map((value) => {
            return value.response.data.posts.post;
        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlCreatePost {
    post: {
        createPost: string
    }
}

export function createPostRequest(PostInput: PostInput) {
    return GetAjaxObservable<GraphqlCreatePost>(`
        mutation($Input: CreatePostInput!){
            post{
              createPost(input: $Input)
            }
          }`,
        {
            "Input": {
                "title": PostInput.title,
                "text": PostInput.text
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.post.createPost;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlUpdatePost {
    post: {
        updatePost: string
    }
}

export function updatePostRequest(text: String, id: Number) {
    return GetAjaxObservable<GraphqlUpdatePost>(`
        mutation($Input: UpdatePostInput!){
            post{
              updatePost(input: $Input)
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

            return value.response.data.post.updatePost;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlAddPostCategory {
    post: {
        addPostCategory: string
    }
}

export function addPostCategoryRequest(post_id: number, category_id: number) {
    return GetAjaxObservable<GraphqlAddPostCategory>(`
        mutation($Input: AddPostCategoryInput!){
            post{
                addPostCategory(input: $Input)
            }
          }`,
        {
            "Input": {
                "post_Id": post_id,
                "category_Id": category_id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.post.addPostCategory;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlRemovePostCategory {
    post: {
        removePostCategory: string
    }
}

export function removePostCategoryRequest(post_id: number, category_id: number) {
    return GetAjaxObservable<GraphqlRemovePostCategory>(`
        mutation($Input: RemovePostCategoryInput!){
            post{
                removePostCategory(input: $Input)
            }
          }`,
        {
            "Input": {
                "post_Id": post_id,
                "category_Id": category_id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.post.removePostCategory;

        }),
        catchError((error) => {
            throw error
        })
    );
}
interface GraphqlDeletePost {
    post: {
        deletePost: string
    }
}

export function deletePostRequest(id: Number) {
    return GetAjaxObservable<GraphqlDeletePost>(`
        mutation($Input: DeletePostInput!){
            post{
              deletePost(input: $Input)
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

            return value.response.data.post.deletePost;

        }),
        catchError((error) => {
            throw error
        })
    );
}


interface GraphqlLikePost {
    post: {
        likePost: string
    }
}

export function likePostRequest(id: Number) {
    return GetAjaxObservable<GraphqlLikePost>(`
        mutation($Input: LikePostInput!){
            post{
              likePost(input: $Input)
            }
          }`,
        {
            "Input": {
                "post_Id": id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.post.likePost;

        }),
        catchError((error) => {
            throw error
        })
    );
}
