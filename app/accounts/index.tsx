import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from '../../redux/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from '../../components/index/Header';
import AccountBox from '../../components/index/AccountBox';
import Account from '../../components/index/Account';
import { addAccount } from '../../redux/accounts';
import { setTheme } from '../../redux/theme';
import { Account as AcountProps } from '../../redux/accounts';
import { Payment } from "../../redux/accounts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Theme, themes } from '../../redux/theme';

function App() {
    const dispatch = useDispatch();
    const accounts = useSelector((state: RootState) => state.accounts);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonData = await AsyncStorage.getItem('data');
                if(jsonData != null){
                    const data: AcountProps[] = JSON.parse(jsonData);
                    data.forEach(item => dispatch(addAccount(item)))
                }
                const themeData = await AsyncStorage.getItem('theme');
                if(themeData != null){
                    dispatch(setTheme(themeData))
                }
            }catch (e) {

            }
        };
        getData()
    }, [])

    const getTotal = (payments: Payment[]) => {
        return payments.map(
            payment => payment.amounts.map(
                item => item.amount * (1 + payment.tax / 100)
            )
        )
        .flat()
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Account/>
            <Header/>
            {accounts.length ?
            accounts.map((item) => (
                <AccountBox 
                    key={item.id} 
                    id={item.id} 
                    name={item.name} 
                    amount={item.payments ? getTotal(item.payments) : 0}
                />
            ))
            :
            <View style={styles.empty}>
                <MaterialCommunityIcons 
                    name="cash-plus" 
                    size={200} 
                    color={theme.third} 
                />
                <Text style={styles.title}>Agrega tu primera cuenta</Text>
            </View>
            }
            <StatusBar backgroundColor={theme.background}/>
        </SafeAreaView>
    );
}

const style = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: theme.text,
        fontSize: 20,
        marginTop: 50
    }
});

export default function Accounts() {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    );
}