import { createSlice } from "@reduxjs/toolkit";

type AccountModal = {
    visible: boolean,
}

const initialModal = {
    visible: false
}

const accountModalSlice = createSlice({
    name: "accountModal",
    initialState: initialModal,
    reducers: {
        setAccountVisible: (state: AccountModal, action: {payload: boolean, type: string}) => {
            state.visible = action.payload
        }
    },
});

export type {AccountModal}
export const { setAccountVisible } = accountModalSlice.actions;
export default accountModalSlice.reducer;