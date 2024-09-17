import { createSlice } from "@reduxjs/toolkit";

type SummaryModal = {
    visible: boolean,
}

const initialState = {
    visible: false
}

const summaryModalSlice = createSlice({
    name: "summaryModal",
    initialState: initialState,
    reducers: {
        setSummaryVisible: (state: SummaryModal, action: {payload: boolean, type: string}) => {
            state.visible = action.payload
        }
    },
});

export type {SummaryModal}
export const { setSummaryVisible } = summaryModalSlice.actions;
export default summaryModalSlice.reducer;