import { catchError, map } from "rxjs";
import { Post, PostInput } from "../Types/Post";
import { GetAjaxObservable } from "./loginRequests";

export function requestPosts(offset: Number, next: Number, order: String, user_timestamp: Date, categories?: number[]) {
    return GetAjaxObservable<Post[]>(`/posts?take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestSearchedPosts(offset: Number, next: Number, user_timestamp: Date, search: string) {
    return GetAjaxObservable<Post[]>(`/posts?take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestUserPosts(username: String, offset: Number, next: Number, order: String, user_timestamp: Date) {
    return GetAjaxObservable<Post[]>(`/posts/user/${username}?take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

interface GraphqlPost {
    posts: {
        post: Post
    }
}

export function requestPostById(id: Number) {
    return GetAjaxObservable<Post>(`/posts/${id}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

interface GraphqlCreatePost {
    post: {
        createPost: string
    }
}

export function createPostRequest(PostInput: PostInput) {
    return GetAjaxObservable(`/posts`, "POST", false, true, PostInput).pipe(
        map(() => {
            return "Post created successfully";
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
