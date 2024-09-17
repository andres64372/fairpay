import { createSlice } from "@reduxjs/toolkit";
import { Payment } from "./accounts";


const initialAccount: Payment = {
    id: "",
    userId: "",
    description: "",
    amounts: [],
    equalAccounts: false,
    tax: 0
}

const paymentSlice = createSlice({
    name: "payment",
    initialState: initialAccount,
    reducers: {
        changeStatePayment: (state: Payment, action: {payload: Payment, type: string}) => {
            state.id = action.payload.id
            state.userId = action.payload.userId
            state.description = action.payload.description
            state.amounts = action.payload.amounts
            state.equalAccounts = action.payload.equalAccounts
            state.tax = action.payload.tax
        },
    },
});

export const { changeStatePayment } = paymentSlice.actions;
export default paymentSlice.reducer;