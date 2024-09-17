import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
    background: string
    primary: string
    secondary: string
    third: string
    text: string
    dropdownTheme: 'LIGHT' | 'DARK'
}

const themes: {[key: string]: Theme} = {
    'light': {
        background: 'white',
        primary: 'white',
        secondary: 'lightgray',
        third: 'black',
        text: 'black',
        dropdownTheme: 'LIGHT'
    },
    'dark': {
        background: 'black',
        primary: 'dimgray',
        secondary: 'darkgrey',
        third: 'white',
        text: 'white',
        dropdownTheme: 'DARK'
    }
}

const storeData = async (value: string) => {
    try {
        await AsyncStorage.setItem('theme', value);
    } catch (e) {

    }
};

type ThemeState = {
    state: string,
}

const initialState = {
    state: 'light'
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        setTheme: (state: ThemeState, action: {payload: string, type: string}) => {
            state.state = action.payload
            storeData(action.payload)            
        },
    },
});

export type {Theme};
export { themes }
export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;