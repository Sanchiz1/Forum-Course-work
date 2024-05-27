import { Epic, ofType } from "redux-observable";
import { catchError, map, merge, mergeMap, of } from "rxjs";
import { requestAccount } from "../../API/userRequests";
import { User } from "../../Types/User";
import { getAccount, setLogInError } from "../Reducers/AccountReducer";

export const getUserAccount = () => ({ type: "getUserAccount" });
export const getUserAccountEpic: Epic = action$ => action$.pipe(
    ofType("getUserAccount"),
    mergeMap(() => requestAccount().pipe(
        map((res: User) => getAccount(res))
    )),
    catchError((error, caught) =>
        merge(of(setLogInError(error.message)),
            caught
        ))
);