import { createSlice } from "@reduxjs/toolkit";
import { Payment } from "./accounts";


const initialPayment: Payment = {
    id: "",
    userId: "",
    description: "",
    amounts: [],
    equalAccounts: false,
    tax: 0,
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
}

const paymentSlice = createSlice({
    name: "payment",
    initialState: initialPayment,
    reducers: {
        changeStatePayment: (state: Payment, action: {payload: Payment, type: string}) => {
            state.id = action.payload.id
            state.userId = action.payload.userId
            state.description = action.payload.description
            state.amounts = action.payload.amounts
            state.equalAccounts = action.payload.equalAccounts
            state.tax = action.payload.tax
            state.date = action.payload.date
        },
    },
});

export const { changeStatePayment } = paymentSlice.actions;
export default paymentSlice.reducer;