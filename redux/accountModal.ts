import { createSlice } from "@reduxjs/toolkit";

type AccountModal = {
    visible: boolean,
}

const initialState = {
    visible: false
}

const accountModalSlice = createSlice({
    name: "accountModal",
    initialState: initialState,
    reducers: {
        setAccountVisible: (state: AccountModal, action: {payload: boolean, type: string}) => {
            state.visible = action.payload
        }
    },
});

export type {AccountModal}
export const { setAccountVisible } = accountModalSlice.actions;
export default accountModalSlice.reducer;