import { ajax } from "rxjs/internal/ajax/ajax";
import { catchError, delay, map, mergeMap, Observable, of, timer } from "rxjs";
import { redirect } from "react-router-dom";
import { GetAjaxObservable, TokenType } from "./loginRequests";
import { getCookie } from "../Helpers/CookieHelper";
import { User, UserInput } from "../Types/User";
import { Post, PostInput } from "../Types/Post";
import { Category } from "../Types/Category";

const url = "https://localhost:7295/graphql";

interface GraphqlCategories {
    categories: {
        categories: Category[]
    }
}

export function requestAllCategories() {
    return GetAjaxObservable<GraphqlCategories>(
        `query{
            categories{
                categories:allCategories{
                    id
                    title
                }
              }
            }`,
        {
            "Input": {
            }
        },
        false
    ).pipe(
        map((value) => {
            return value.response.data.categories.categories;
        }),
        catchError((error) => {
            throw error
        })
    );
}

export function requestCategories(offset: Number, next: Number, search?: string) {
    return GetAjaxObservable<GraphqlCategories>(
        `query($Input:  GetCategoriesInput!){
            categories{
                categories(input: $Input){
                    id
                    title
                }
              }
            }`,
        {
            "Input": {
                "search": search,
                "offset": offset,
                "next": next
            }
        },
        false
    ).pipe(
        map((value) => {
            return value.response.data.categories.categories;
        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlCategory {
    categories: {
        category: Post
    }
}

export function requestCategoryById(id: Number) {
    return GetAjaxObservable<GraphqlCategory>(
        `query($Input:  GetCategoryByIdInput!){
            categories{
                category(input: $Input){
                    id
                    title
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
            return value.response.data.categories.category
        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlCreateCategory {
    category: {
        createCategory: string
    }
}

export function createCategoryRequest(title: string) {
    return GetAjaxObservable<GraphqlCreateCategory>(`
        mutation($Input: CreateCategoryInput!){
            category{
              createCategory(input: $Input)
            }
          }`,
        {
            "Input": {
                "title": title,
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.category.createCategory;

        }),
        catchError((error) => {
            throw error
        })
    );
}

interface GraphqlUpdateCategory {
    category: {
        updateCategory: string
    }
}

export function updateCategoryRequest(title: String, id: Number) {
    return GetAjaxObservable<GraphqlUpdateCategory>(`
        mutation($Input: UpdateCategoryInput!){
            category{
              updateCategory(input: $Input)
            }
          }`,
        {
            "Input": {
                "title": title,
                "id": id
            }
        }
    ).pipe(
        map((value) => {

            if (value.response.errors) {

                throw new Error(value.response.errors[0].message);
            }

            return value.response.data.category.updateCategory;

        }),
        catchError((error) => {
            throw error
        })
    );
}


interface GraphqlDeleteCategory {
    category: {
        deleteCategory: string
    }
}

export function deleteCategoryRequest(id: Number) {
    return GetAjaxObservable<GraphqlDeleteCategory>(`
        mutation($Input: DeleteCategoryInput!){
            category{
              deleteCategory(input: $Input)
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

            return value.response.data.category.deleteCategory;

        }),
        catchError((error) => {
            throw error
        })
    );
}