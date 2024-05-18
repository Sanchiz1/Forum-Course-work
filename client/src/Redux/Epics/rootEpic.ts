import { combineEpics, Epic } from "redux-observable";
import { catchError } from "rxjs";
import { getUserAccountEpic } from "./AccountEpics";

export const rootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        getUserAccountEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            return source;
        })
    );