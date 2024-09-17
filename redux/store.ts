import { configureStore } from "@reduxjs/toolkit";

import accountReducer from './accounts'
import accountStateReducer from "./account";
import paymentStateReducer from "./payment"
import accountModalReducer from "./accountModal";
import paymentModalReducer from "./paymentModal";
import summaryModalReducer from "./summaryModal";
import themeReducer from "./theme"

export const store = configureStore({
    reducer: {
        accountState: accountStateReducer,
        paymentState: paymentStateReducer,
        accounts: accountReducer,
        accountModal: accountModalReducer,
        paymentModal: paymentModalReducer,
        summaryModal: summaryModalReducer,
        theme: themeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;