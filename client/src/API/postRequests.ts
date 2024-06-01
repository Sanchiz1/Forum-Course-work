import { NotFoundError, catchError, empty, map, of } from "rxjs";
import { Post, PostInput } from "../Types/Post";
import { GetAjaxObservable } from "./APIUtils";

export function requestPosts(offset: Number, next: Number, order: String, userTimestamp: Date, categories?: number[]) {
    return GetAjaxObservable<Post[]>(`/posts?userTimestamp=${userTimestamp.toISOString()}&take=${next}&skip=${offset}&orderBy=${order}&categories=${categories}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestSearchedPosts(offset: Number, next: Number, userTimestamp: Date, search: string, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<Post[]>(`/posts/search?search=${search}&userTimestamp=${userTimestamp.toISOString()}&take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestUserPosts(username: String, offset: Number, next: Number, order: String, userTimestamp: Date) {
    return GetAjaxObservable<Post[]>(`/posts/user/${username}?userTimestamp=${userTimestamp.toISOString()}&take=${next}&skip=${offset}&orderBy=${order}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestPostById(id: Number) {
    return GetAjaxObservable<Post>(`/posts/${id}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        }),
        catchError((error) => {
            if(error instanceof NotFoundError){
                return of(null);
            }

            throw error
        })
    );
}

export function createPostRequest(PostInput: PostInput) {
    return GetAjaxObservable(`/posts`, "POST", true, true, PostInput).pipe(
        map(() => {
            return "Post created successfully";
        })
    );
}

export function updatePostRequest(text: String, id: Number) {
    return GetAjaxObservable(`/posts/${id}`, "PATCH", true, true, {text: text}).pipe(
        map(() => {
            return "Post updated successfully";
        })
    );
}

export function deletePostRequest(id: Number) {
    return GetAjaxObservable(`/posts/${id}`, "DELETE", true, true).pipe(
        map(() => {
            return "Post updated successfully";
        })
    );
}

export function likePostRequest(id: Number) {
    
    return GetAjaxObservable(`/posts/like/${id}`, "POST", true, true);
}


export function addPostCategoryRequest(postId: number, categoryId: number) {
    return GetAjaxObservable(`/categories/post/${postId}?categoryId=${categoryId}`, "POST", true, true);
}

export function removePostCategoryRequest(postId: number, categoryId: number) {
    return GetAjaxObservable(`/categories/post/${postId}?categoryId=${categoryId}`, "DELETE", true, true);
}