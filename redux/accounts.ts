import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Account = {
    id: string
    name: string
    users: Array<User>
    payments: Array<Payment>
}

type User = {
    id: string
    name: string
}

type Payment = {
    id: string
    userId: string
    description: string
    amounts: Array<UserPayment>
    equalAccounts: boolean
    tax: number
}

type UserPayment = {
    userId: string
    amount: number
}

const initialAccounts: Array<Account> = [];

const storeData = async (value: Account[]) => {
    try {
        await AsyncStorage.setItem('data', JSON.stringify(value));
    } catch (e) {

    }
};

const accountSlice = createSlice({
    name: 'accounts',
    initialState: initialAccounts,
    reducers: {
        addAccount: (state: Array<Account>, action: {payload: Account, type: string}) => {
            if(state.some(item => item.id === action.payload.id)){
                state.forEach((item, index) => {
                    if(item.id === action.payload.id){
                        state[index] = action.payload
                    }
                })
            }else{
                state.push(action.payload)
            }
            storeData(state);
        },
        editAccount: (state: Array<Account>, action: {payload: Account, type: string}) => {
            state.forEach((item, index) => {
                if(item.id === action.payload.id){
                    state[index] = action.payload
                }
            })
            storeData(state);
        },
        deleteAccount: (state: Array<Account>, action: {payload: string, type: string}) => {
            for (let i = state.length - 1; i >= 0; i--) {
                if (state[i].id === action.payload) {
                    state.splice(i, 1);
                }
            }
            storeData(state);
        },
    },
});

export type {Account, Payment, UserPayment}
export const { addAccount, editAccount, deleteAccount } = accountSlice.actions;
export default accountSlice.reducer;