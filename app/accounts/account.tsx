import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '../../redux/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from '../../components/account/Header';
import PaymentBox from '../../components/account/PaymentBox';
import Payment from '../../components/account/Payment';
import { UserPayment } from "../../redux/accounts";
import Summary from '../../components/account/Summary';
import { Theme, themes } from '../../redux/theme';

function App() {
    const account = useSelector((state: RootState) => state.accountState);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    const getTotal = (payment: UserPayment[], tax: number) => {
        const amounts = payment.map(item => item.amount * (1 + tax / 100));
        return amounts.reduce(
            (accumulator, currentValue) => accumulator + currentValue, 0,
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Payment/>
            <Summary/>
            <Header/>
            {account.payments.length ?
                account.payments.map(item => (
                    <PaymentBox 
                        key={item.id} 
                        id={item.id} 
                        name={item.description} 
                        amount={item.amounts ? getTotal(item.amounts, item.tax) : 0}
                    />
                ))
            :
                <View style={styles.empty}>
                    <MaterialCommunityIcons 
                        name="cash-plus" 
                        size={200} 
                        color={theme.third}
                    />
                    <Text style={styles.title}>Aun no tienes registros</Text>
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
        fontSize: 20,
        marginTop: 50,
        color: theme.text
    }
});

export default function Account() {
    return (
        <Provider store={store}>                
            <App/>
        </Provider>
    );
}