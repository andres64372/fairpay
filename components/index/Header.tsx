import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { RootState } from '../../redux/store';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { setAccountVisible } from '../../redux/accountModal';
import { changeStateAccount } from '../../redux/account';
import { setTheme } from '../../redux/theme';
import { randomUUID } from 'expo-crypto';
import { Theme, themes } from '../../redux/theme';

export default function Header(){
    const dispatch = useDispatch();
    const themeState = useSelector((state: RootState) => state.theme.state);
    const theme = themes[themeState];
    const styles = style(theme);

    const handleMode = () => {
        dispatch(setTheme(themeState === 'light' ? 'dark' : 'light'));
    }

    const handleAccount = () => {
        dispatch(changeStateAccount({
            id: randomUUID(),
            name: "Cuenta",
            users: [{
                id: randomUUID(),
                name: "Integrante 1"
            }],
            payments: []
        }));
        dispatch(setAccountVisible(true))
    }

    return (
        <View style={styles.container}>
            <View style={styles.add} onTouchEnd={handleAccount}>
                <AntDesign 
                    name="plus" 
                    size={24} 
                    color={theme.third}
                />
            </View>
            <View style={styles.mode} onTouchEnd={handleMode}>
                <MaterialIcons 
                    name="dark-mode" 
                    size={24} 
                    color={theme.third}
                />
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
    add: {
        alignItems: 'flex-start',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    mode: {
        alignItems: 'flex-end',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    checkbox: {
        marginHorizontal: 20,
    }
});