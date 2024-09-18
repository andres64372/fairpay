import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAccountVisible } from '../../redux/accountModal';
import { changeStateAccount } from '../../redux/account';
import { addAccount } from '../../redux/accounts';
import { randomUUID } from 'expo-crypto';
import { 
    StyleSheet, 
    View, 
    Modal, 
    TextInput, 
    Text, 
    ScrollView 
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Theme, themes } from '../../redux/theme';

type AccountInputProps = {
    name: string
}

function AccountInput({name}: AccountInputProps) {
    const account = useSelector((state: RootState) => state.accountState);
    const dispatch = useDispatch();
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);
    const accountInputStyles = accountInputStyle(theme);
    const [text, setText] = useState<string>(name);

    const updateName = (value: string) => {
        dispatch(changeStateAccount({
            ...account,
            name: value
        }));
        setText(value);
    }

    return (
        <View style={accountInputStyles.container}>
            <TextInput 
                style={styles.input} 
                placeholder='Nombre de la cuenta'
                autoCapitalize='words'
                value={text}
                onChangeText={updateName}
            />
        </View>
    )
}

const accountInputStyle = (_: Theme) => StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 30,
        width: 300,
    },
})

type UserInputProps = {
    id: string
    name: string
    enabled: boolean
}

function UserInput({id, name, enabled}: UserInputProps) {
    const account = useSelector((state: RootState) => state.accountState);
    const dispatch = useDispatch();
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);
    const userInputStyles = userInputStyle(theme);
    const [text, setText] = useState<string>(name);

    const deleteUser = () => {
        account.users.length > 1 && dispatch(changeStateAccount({
            ...account,
            users: account.users.filter(user => user.id !== id),
            payments: account.payments.map(
                payment => ({...payment, amounts: payment.amounts.filter(
                    amount => amount.userId !== id
                )})
            )
        }));
    }

    const updateName = (value: string) => {
        dispatch(changeStateAccount({
            ...account,
            users: account.users.map(user => (
                user.id === id ? {...user, name: value} : user
            ))
        }));
        setText(value);
    }

    return (
        <View style={userInputStyles.container}>
            <View style={userInputStyles.input}>
                <TextInput 
                    style={styles.input} 
                    placeholder='Nombre del integrante'
                    autoCapitalize='words'
                    value={text}
                    onChangeText={updateName}
                />
            </View>
            <View style={userInputStyles.delete}>
                <Feather name='trash' size={24} color='red' onPress={deleteUser}/>
            </View>
        </View>
    )
}

const userInputStyle = (_: Theme) => StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        width: 300,
        flexDirection: 'row'
    },
    input: {
        flex: 1
    },
    delete: {
        marginLeft: 10,
        justifyContent: 'center'
    }
})

export default function Account() {
    const createModal = useSelector((state: RootState) => state.accountModal.visible);
    const account = useSelector((state: RootState) => state.accountState);
    const dispatch = useDispatch();
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    const addUser = () => {
        const id = randomUUID();
        dispatch(changeStateAccount({
            ...account,
            users: [...account.users, {
                id: id,
                name: `Integrante ${account.users.length + 1}`
            }],
            payments: account.payments.map(
                payment => ({...payment, amounts: [...payment.amounts, {
                    userId: id, amount: 0, equalAccounts: false
                }]})
            )
        }));
    }

    const saveAccount = () => {
        dispatch(addAccount(account));
        dispatch(setAccountVisible(false));
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
                            onTouchEnd={() => dispatch(setAccountVisible(false))}
                        >
                            <AntDesign 
                                name='close' 
                                size={30} 
                                color={theme.third}
                            />
                        </View>
                        <View style={styles.save} onTouchEnd={saveAccount}>
                            <AntDesign 
                                name='save' 
                                size={30} 
                                color={theme.third}
                            />
                        </View>
                    </View>
                    <Text style={styles.label}>Cuenta</Text>
                    <AccountInput key={account.id} name={account.name}/>
                    <ScrollView>
                        <Text style={styles.label}>Integrantes</Text>
                        <View style={styles.users}>
                            {account.users.map((item) => (
                                <UserInput 
                                    key={item.id} 
                                    id={item.id} 
                                    name={item.name}
                                    enabled={account.payments.length === 0}
                                />
                            ))}
                            <AntDesign
                                style={styles.add_items} 
                                name="pluscircleo" 
                                size={50} 
                                color={theme.secondary}
                                onPress={addUser}
                            />
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
    label: {
        color: theme.text,
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
        marginVertical: 60,
        backgroundColor: theme.primary,
        paddingVertical: 30,
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
        color: theme.text,
    },
    users: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    add_items: {
        marginTop: 30,
    }
});