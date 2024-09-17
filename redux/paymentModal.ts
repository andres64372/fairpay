import { createSlice } from "@reduxjs/toolkit";

type PaymentModal = {
    visible: boolean,
}

const initialState = {
    visible: false
}

const paymentModalSlice = createSlice({
    name: "paymentModal",
    initialState: initialState,
    reducers: {
        setPaymentVisible: (state: PaymentModal, action: {payload: boolean, type: string}) => {
            state.visible = action.payload
        }
    },
});

export type {PaymentModal}
export const { setPaymentVisible } = paymentModalSlice.actions;
export default paymentModalSlice.reducer;