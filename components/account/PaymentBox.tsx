import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { RootState } from '../../redux/store';
import { setPaymentVisible } from '../../redux/paymentModal';
import { changeStatePayment } from '../../redux/payment';
import { changeStateAccount } from '../../redux/account';
import { Theme, themes } from '../../redux/theme';
import { editAccount } from '../../redux/accounts';

interface Props {
    id: string
    name: string
    amount: number
}

const format = new Intl.NumberFormat(
    'es', {style: 'decimal', maximumFractionDigits: 2}
);

export default function PaymentBox({id, name, amount}: Props) {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.accountState);
    const payment = account.payments.filter(item => item.id === id);
    const user = account.users.filter(item => item.id === payment[0].userId)[0].name
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    const handleEdit = () => {
        dispatch(changeStatePayment(
            account.payments.filter(item => item.id === id)[0]
        ));
        dispatch(setPaymentVisible(true));
    }

    const handleDelete = () => {
        dispatch(changeStateAccount({
            ...account,
            payments: account.payments.filter(item => item.id !== id)
        }));
        dispatch(editAccount({
            ...account,
            payments: account.payments.filter(item => item.id !== id)
        }));
    }

    return (
        <View style={styles.container}>
            <View style={styles.info} onTouchEnd={() => {}}>
                <Text style={styles.info_name}>{name}</Text>
                <Text style={styles.info_amount}>{user}</Text>
                <Text style={styles.info_amount}>$ {format.format(amount)}</Text>
            </View>
            <View style={styles.actions}>
                <View style={styles.edit} onTouchEnd={handleEdit}>
                    <Feather 
                        name="edit" 
                        size={24} 
                        color={theme.third}
                    />
                </View>
                <View style={styles.delete} onTouchEnd={handleDelete}>
                    <Feather 
                        name="trash" 
                        size={24} 
                        color={theme.third}
                    />
                </View>
            </View>
        </View>
    );
}
  
const style = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.secondary,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 20,
    },
    info: {
        alignItems: 'flex-start',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    info_name: {
        fontSize: 20,
        color: theme.text,
    },
    info_amount: {
        fontSize: 15,
        color: theme.text,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 20,
    },
    edit: {
        paddingHorizontal: 10,
    },
    delete: {
        paddingHorizontal: 10,
    }
});