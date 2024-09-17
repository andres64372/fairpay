import React, { createContext, useState, useContext } from 'react';

type Theme = {
    background: string
    primary: string
    secondary: string
    third: string
    text: string
}

const lightTheme: Theme = {
    background: 'white',
    primary: 'white',
    secondary: 'lightgray',
    third: 'black',
    text: 'black'
};
  
const darkTheme: Theme = {
    background: 'black',
    primary: 'dimgray',
    secondary: 'darkgrey',
    third: 'white',
    text: 'white'
};

const theme = darkTheme;

const ThemeContext = createContext('light');
export const useTheme = () => useContext(ThemeContext);

export default theme