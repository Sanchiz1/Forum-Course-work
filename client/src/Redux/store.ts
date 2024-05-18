import {configureStore} from "@reduxjs/toolkit";
import {createEpicMiddleware} from "redux-observable";
import { useDispatch } from "react-redux";
import AccountReducer  from "./Reducers/AccountReducer"
import { rootEpic } from "./Epics/rootEpic";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
   reducer: {
    account: AccountReducer
   },
   middleware: [epicMiddleware]
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = ReturnType<typeof useDispatch>
export default store;