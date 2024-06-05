import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../Types/User"

export interface AccountState {
    Account: User,
    GlobalError: string,
    PermissionError: string,
    LogInError: string
}
const initialState: AccountState = {
    Account: {} as User,
    GlobalError: '',
    PermissionError: '',
    LogInError: ''
};

export const AccountSlice = createSlice({
    name: "Account",
    initialState,
    reducers: {
        getAccount: (state,
            action: PayloadAction<User>) => {
            state.Account = action.payload;
        },
        setLogInError: (state,
            action: PayloadAction<string>) => {
            state.LogInError = action.payload;
        },
        setPermissionError: (state,
            action: PayloadAction<string>) => {
            state.PermissionError = action.payload;
        },
        setGlobalError: (state,
            action: PayloadAction<string>) => {
            state.GlobalError = action.payload;
        }
    }
});

export const {
    getAccount,
    setLogInError,
    setGlobalError,
    setPermissionError
} = AccountSlice.actions;
export default AccountSlice.reducer;