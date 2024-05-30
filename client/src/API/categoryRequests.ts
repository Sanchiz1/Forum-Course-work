import { catchError, map } from "rxjs";
import { Category } from "../Types/Category";
import { Post } from "../Types/Post";
import { GetAjaxObservable } from "./APIUtils";

export function requestAllCategories() {
    return GetAjaxObservable<Category[]>(`/categories/all`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestCategories(offset: Number, next: Number) {
    return GetAjaxObservable<Category[]>(`/categories?take=${next}&skip=${offset}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestPostCategories(postId: number) {
    return GetAjaxObservable<Category[]>(`/categories/post?postId=${postId}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function requestCategoryById(id: Number) {
    return GetAjaxObservable<Category[]>(`/categories/${id}`, "GET", false, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function createCategoryRequest(title: string) {
    return GetAjaxObservable(`/categories`, "POST", true, true, {title: title}).pipe(
        map(() => {
            return "Created category successfully";
        })
    );
}

export function updateCategoryRequest(title: String, id: Number) {
    return GetAjaxObservable(`/categories/${id}`, "PATCH", true, true, {title: title}).pipe(
        map(() => {
            return "Updated category successfully";
        })
    );
}

export function deleteCategoryRequest(id: Number) {
    return GetAjaxObservable(`/categories/${id}`, "DELETE", true, true).pipe(
        map(() => {
            return "Deleted category successfully";
        })
    );
}