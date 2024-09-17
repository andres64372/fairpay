import { createSlice } from "@reduxjs/toolkit";
import { Account } from "./accounts";


const initialAccount: Account = {
    id: "",
    name: "",
    users: [],
    payments: []
}

const accountSlice = createSlice({
    name: "account",
    initialState: initialAccount,
    reducers: {
        changeStateAccount: (state: Account, action: {payload: Account, type: string}) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.users = action.payload.users
            state.payments = action.payload.payments
        },
    },
});

export const { changeStateAccount } = accountSlice.actions;
export default accountSlice.reducer;