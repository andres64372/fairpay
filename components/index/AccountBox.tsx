import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { deleteAccount } from '../../redux/accounts';
import { RootState } from '../../redux/store';
import { setAccountVisible } from '../../redux/accountModal';
import { changeStateAccount } from '../../redux/account';
import { router } from 'expo-router';
import { Theme, themes } from '../../redux/theme';

interface Props {
    id: string
    name: string
    amount: number
}

const format = new Intl.NumberFormat('es', {style: 'decimal'});

export default function AccountBox({id, name, amount}: Props) {
    const dispatch = useDispatch();
    const accounts = useSelector((state: RootState) => state.accounts);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    const handleEdit = () => {
        dispatch(changeStateAccount(accounts.filter(item => item.id === id)[0]));
        dispatch(setAccountVisible(true))
    }

    const handleDelete = () => {
        
        Alert.alert('Estas seguro de borrar este elemento?', 'Esta acción no se puede deshacer', [{
            text: 'No',
            style: 'cancel',
        },{
            text: 'Si', 
            onPress: () => {
                dispatch(deleteAccount(id));
            }
        }]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.info} onTouchEnd={() => {router.navigate(`/account/${id}`)}}>
                <Text style={styles.info_name}>{name}</Text>
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