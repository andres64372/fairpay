import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { setPaymentVisible } from '../../redux/paymentModal';
import { setSummaryVisible } from '../../redux/summaryModal';
import { changeStatePayment } from '../../redux/payment';
import { RootState } from '../../redux/store';
import { randomUUID } from 'expo-crypto';
import { Payment } from '../../redux/accounts';
import { setTheme } from '../../redux/theme';
import { Theme, themes } from '../../redux/theme';

export default function Header(){
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.accountState);
    const summary = useSelector((state: RootState) => state.summaryModal.visible);
    const themeState = useSelector((state: RootState) => state.theme.state);
    const theme = themes[themeState];
    const styles = style(theme);

    const handleMode = () => {
        dispatch(setTheme(themeState === 'light' ? 'dark' : 'light'));
    }

    const handleSummary = () => {
        dispatch(setSummaryVisible(!summary));
    }

    const handlePayment = () => {
        const initialPayment: Payment = {
            id: randomUUID(),
            userId: account.users[0].id,
            description: "Abono",
            amounts: account.users.map(item => (
                {userId: item.id, amount: 0}
            )),
            equalAccounts: false,
            tax: 0
        }
        dispatch(changeStatePayment(initialPayment));
        dispatch(setPaymentVisible(true))
    }

    return (
        <View style={styles.container}>
            <View style={styles.back} onTouchEnd={() => router.back()}>
                <AntDesign 
                    name="back" 
                    size={24} 
                    color={theme.third} 
                />
            </View>
            <View style={styles.actions}>
                <View style={styles.mode} onTouchEnd={handleMode}>
                    <MaterialIcons 
                        name="dark-mode" 
                        size={24} 
                        color={theme.third} 
                    />
                </View>
                {account.payments.length > 0 &&
                <View style={styles.export} onTouchEnd={handleSummary}>
                    <AntDesign 
                        name="export" 
                        size={24} 
                        color={theme.third} 
                    />
                </View>
                }
                <View style={styles.add} onTouchEnd={handlePayment}>
                    <AntDesign 
                        name="plus" 
                        size={24} 
                        color={theme.third} 
                    />
                </View>
            </View>
        </View>
    )
}

const style = (_: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 20,
    },
    back: {
        alignItems: 'flex-start',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    export: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    add: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    mode: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    checkbox: {
        marginHorizontal: 20,
    }
});