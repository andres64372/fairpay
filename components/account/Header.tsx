import { Text } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { setPaymentVisible } from '../../redux/paymentModal';
import { setSummaryVisible } from '../../redux/summaryModal';
import { changeStatePayment } from '../../redux/payment';
import { RootState } from '../../redux/store';
import { randomUUID } from 'expo-crypto';
import { Theme, themes } from '../../redux/theme';

export default function Header(){
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.accountState);
    const summary = useSelector((state: RootState) => state.summaryModal.visible);
    const themeState = useSelector((state: RootState) => state.theme.state);
    const theme = themes[themeState];
    const styles = style(theme);

    const handleSummary = () => {
        dispatch(setSummaryVisible(!summary));
    }

    const handlePayment = () => {
        dispatch(changeStatePayment({
            id: randomUUID(),
            userId: account.users[0].id,
            description: "Abono",
            amounts: account.users.map(item => (
                {userId: item.id, amount: 0, equalAccounts: false}
            )),
            equalAccounts: false,
            tax: 0
        }));
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
            <Text style={styles.title}>{account.name}</Text>
            <View style={styles.actions}>
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

const style = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 20,
    },
    back: {
        flexDirection: 'row',
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
    },
    title: {
        fontSize: 20,
        color: theme.text
    },
});