import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPaymentVisible } from '../../redux/paymentModal';
import { changeStatePayment } from '../../redux/payment';
import { changeStateAccount } from '../../redux/account';
import { 
    StyleSheet, 
    View, 
    Modal, 
    TextInput, 
    Text, 
    ScrollView 
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { Payment as PaymentType } from '../../redux/accounts';
import { Theme, themes } from '../../redux/theme';
import { editAccount } from '../../redux/accounts';

function PaymentInput() {
    const payment = useSelector((state: RootState) => state.paymentState);
    const account = useSelector((state: RootState) => state.accountState);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);
    const accountInputStyles = accountInputStyle(theme);
    const dispatch = useDispatch();
    const [text, setText] = useState<string>(payment.description);
    const [taxAmount, setTaxAmount] = useState<number>(payment.tax)
    const [amount, setAmount] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(payment.userId);

    useEffect(() => {
        const total = payment.amounts.reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue.amount), 0
        );
        setAmount(total);
    }, [payment])

    const updateName = (e: string) => {
        const updatedPayment: PaymentType = {
            ...payment,
            description: e
        };
        dispatch(changeStatePayment(updatedPayment));
        setText(e);
    }

    const updateAmount = (e: number) => {
        const updatedPayment: PaymentType = {
            ...payment,
            amounts: payment.amounts.map(item => (
                {...item, amount: e / account.users.length}
            ))
        }
        dispatch(changeStatePayment(updatedPayment));
        setAmount(e);
    }

    const updateTax = (value: number) => {
        dispatch(changeStatePayment({
            ...payment,
            tax: value
        }));
        setTaxAmount(value);
    }

    const equalAccounts = (value: boolean) => {
        value ?
            dispatch(changeStatePayment({
                ...payment, equalAccounts: true, amounts: payment.amounts.map(item => (
                    {
                        ...item, 
                        equalAccounts: true, amount: amount / account.users.length
                    }
                ))
            }))
        :
            dispatch(changeStatePayment({
                ...payment, equalAccounts: false, amounts: payment.amounts.map(item => (
                    {...item, equalAccounts: false}
                ))
            }))
    }
    
    const setUser = (value: any) => {
        const item: string = value()
        dispatch(changeStatePayment({
            ...payment,
            userId: item
        }));
        setValue(item)
    }

    return (
        <View style={accountInputStyles.container}>
            <View style={accountInputStyles.input_container}>
                <TextInput 
                    style={styles.input} 
                    placeholder='Descripción'
                    autoCapitalize='words'
                    value={text}
                    onChangeText={updateName}
                />
            </View>
            <View style={accountInputStyles.input_container}>
                <View style={accountInputStyles.amount_container}>
                    <View style={accountInputStyles.amount}>
                        <Text style={styles.label}>Total</Text>
                        <CurrencyInput 
                            style={[styles.currency_input, {
                                color: payment.equalAccounts ? 
                                    theme.text 
                                : 
                                    theme.secondary
                            }]}
                            value={amount}
                            prefix="$ "
                            precision={0}
                            onChangeValue={updateAmount}
                            minValue={0}
                            editable={payment.equalAccounts}
                        />
                    </View>
                    <View style={accountInputStyles.amount}>
                        <Text style={styles.label}>% Servicio</Text>
                        <CurrencyInput 
                            style={styles.currency_input}
                            value={taxAmount}
                            prefix="% " 
                            precision={0}
                            onChangeValue={updateTax}
                            minValue={0}
                        />
                    </View>
                </View>
                <View style={accountInputStyles.amount_container}>
                    <View style={accountInputStyles.user}>
                        <Text style={styles.label}>Pagador</Text>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={account.users.map(item => 
                                ({label: item.name, value: item.id})
                            )}
                            setOpen={setOpen}
                            setValue={setUser}
                            style={styles.picker_style}
                            textStyle={styles.text_style}
                            dropDownContainerStyle={styles.container_style}
                            theme={theme.dropdownTheme}
                        />
                    </View>
                </View>
                <View style={accountInputStyles.input_container}>
                    <Text style={styles.label}>Cuentas por igual</Text>
                    <Checkbox 
                        value={payment.equalAccounts} 
                        onValueChange={equalAccounts}
                    />
                </View>
            </View>
        </View>
    )
}

const accountInputStyle = (_: Theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginBottom: 20,
        width: 300,
    },
    input_container: {
        marginVertical: 5,
    },
    amount_container: {
        flexDirection: 'row'
    },
    user: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    cash: {
        marginHorizontal: 5,
        justifyContent: 'center'
    },
    amount: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 10,
    }
})


type UserInputProps = {
    id: string
    name: string
    amount: number
    equalAccounts: boolean
}

function UserInput({id, name, amount, equalAccounts}: UserInputProps) {
    const payment = useSelector((state: RootState) => state.paymentState);
    const dispatch = useDispatch();
    const [text, setText] = useState<number>(amount);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);
    const userInputStyles = userInputStyle(theme);

    const total = payment.amounts.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.amount), 0
    );

    useEffect(() => {
        payment.equalAccounts && setText(amount);
    }, [amount])

    const updateAmmount = (e: number) => {
        dispatch(changeStatePayment({
            ...payment,
            amounts: payment.amounts.map(item => (
                item.userId === id ? {...item, amount: e} : item
            ))
        }));
        setText(e);
    }

    const setEqualAccounts = (value: boolean) => {
        const users = value ? 
        payment.amounts.filter(item => item.equalAccounts).length + 1
        :
        payment.amounts.filter(item => item.equalAccounts).length - 1;
        
        value ?
            dispatch(changeStatePayment({
                ...payment, amounts: payment.amounts
                .map(item => (
                    item.userId === id ? 
                        {...item, equalAccounts: true, amount: total / users} 
                    : 
                        {...item, amount: total / users} 
                ))
            }))
        :
            dispatch(changeStatePayment({
                ...payment, amounts: payment.amounts
                .map(item => (
                    item.userId === id ? 
                        {...item, equalAccounts: false, amount: 0} 
                    : 
                        {...item, amount: total / users}
                ))
            }));
    }

    return (
        <View style={userInputStyles.container}>
            <View style={userInputStyles.name}>
                <Text style={styles.label}>{name}</Text>
            </View>
            {payment.equalAccounts &&
            <View style={userInputStyles.checkbox}>
                <Checkbox
                    value={equalAccounts}
                    onValueChange={setEqualAccounts}
                />
            </View>
            }
            <View style={userInputStyles.input}>
                <CurrencyInput
                    style={[styles.input, {
                        color: !payment.equalAccounts ? theme.text : theme.secondary
                    }]} 
                    value={text}
                    prefix="$ "
                    precision={0}
                    onChangeValue={updateAmmount}
                    editable={!payment.equalAccounts}
                />
            </View>
        </View>
    )
}

const userInputStyle = (_: Theme) => StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 300,
        flexDirection: 'row'
    },
    name: {
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        flex: 1
    },
    checkbox: {
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    delete: {
        marginLeft: 10,
        justifyContent: 'center'
    }
})

export default function Payment() {
    const createModal = useSelector((state: RootState) => state.paymentModal.visible);
    const payment = useSelector((state: RootState) => state.paymentState);
    const account = useSelector((state: RootState) => state.accountState);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);
    const dispatch = useDispatch();

    const savePayment = () => {
        account.payments.some(item => item.id === payment.id) ?
            dispatch(changeStateAccount({
                ...account,
                payments: account.payments.map(item => (
                    item.id === payment.id ? payment : item
                ))
            }))
        :
            dispatch(changeStateAccount({
                ...account,
                payments: [...account.payments, payment]
            }));
        account.payments.some(item => item.id === payment.id) ?
            dispatch(editAccount({
                ...account,
                payments: account.payments.map(item => (
                    item.id === payment.id ? payment : item
                ))
            }))
        :
            dispatch(editAccount({
                ...account,
                payments: [...account.payments, payment]
            }));
        dispatch(setPaymentVisible(false));
    } 

    return(
        <Modal
            animationType='fade'
            transparent={true}
            visible={createModal}
        >
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.header}>
                        <View 
                            style={styles.close} 
                            onTouchEnd={() => dispatch(setPaymentVisible(false))}
                        >
                            <AntDesign 
                                name='close' 
                                size={30} 
                                color={theme.third}
                            />
                        </View>
                        <View style={styles.save} onTouchEnd={savePayment}>
                            <AntDesign 
                                name='save' 
                                size={30} 
                                color={theme.third}
                            />
                        </View>
                    </View>
                    <Text style={styles.title}>Abono</Text>
                    <PaymentInput/>
                    <ScrollView>
                        <Text style={styles.title}>Integrantes</Text>
                        <View style={styles.users}>
                            {account.users.map((item) => (
                                <UserInput 
                                    key={item.id} 
                                    id={item.id}
                                    name={item.name}
                                    amount={
                                        payment.amounts.filter(
                                            amount => amount.userId === item.id
                                        )[0]?.amount
                                    }
                                    equalAccounts={
                                        payment.amounts.filter(
                                            amount => amount.userId === item.id
                                        )[0]?.equalAccounts
                                    }  
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const style = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    close: {
        marginBottom: 10,
        padding: 10,
        flex: 1
    },
    save: {
        marginBottom: 10,
        padding: 10,
        flex: 1,
        alignItems: 'flex-end'
    },
    box: {
        flex: 1,
        marginVertical: 30,
        backgroundColor: theme.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row'
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: theme.secondary,
        color: theme.text
    },
    currency_input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: theme.secondary,
        color: theme.text
    },
    picker_style: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: theme.secondary,
        color: theme.text,
        backgroundColor: theme.primary,
    },
    text_style: {
        fontSize: 14,
        color: theme.text,
    },
    container_style: {
        backgroundColor: theme.primary,
        borderColor: theme.secondary,
        color: 'red'
    },
    users: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        color: theme.text
    },
    label: {
        color: theme.text
    },
    disabled: {
        color: theme.third
    }
});