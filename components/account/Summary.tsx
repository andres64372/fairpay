import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { 
    StyleSheet, 
    View, 
    Modal,
    Text,
    ScrollView
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { setSummaryVisible } from '../../redux/summaryModal';
import { Theme, themes } from '../../redux/theme';

const dots = '............................................';
const format = new Intl.NumberFormat(
    'es', {style: 'decimal', maximumFractionDigits: 2}
);

type ItemProps = {
    name: string,
    amount: number
}

function Item({name, amount}: ItemProps){
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    return(
        <View>
            <View style={styles.element}>
                <View style={styles.topic}>
                    <Text style={styles.item} numberOfLines={1}>{name}{dots}</Text>
                </View>
                <View>
                    {amount >= 0 ?
                        <Text style={styles.item_positive}>
                            $ {format.format(amount)}
                        </Text>
                    :
                        <Text style={styles.item_negative}>
                            $ {format.format(amount)}
                        </Text>
                    }
                </View>
            </View>
        </View>
    )
}

type TotalProps = {
    amount: number
}

function Total({amount}: TotalProps){
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    return(
        <View style={styles.content}>
            <View style={styles.element}>
                <View style={styles.topic}>
                    <Text style={styles.total} numberOfLines={1}>Total{dots}</Text>
                </View>
                <View>
                    <Text style={styles.total}>$ {format.format(amount)}</Text>
                </View>
            </View>
        </View>
    )
}

export default function Summary() {
    const dispatch = useDispatch();
    const summary = useSelector((state: RootState) => state.summaryModal.visible);
    const account = useSelector((state: RootState) => state.accountState);
    const theme = themes[useSelector((state: RootState) => state.theme.state)];
    const styles = style(theme);

    const getUserTotalDue = (userId: string) => {
        return account.payments.map(
            payment => payment.amounts.filter(
                amount => amount.userId === userId
            ).map(item => item.amount * (1 + payment.tax / 100))
        )
        .flat()
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    const getUserTotalPay = (userId: string) => {
        return account.payments.filter(item => item.userId === userId)
        .map(payment => payment.amounts.map(
            amount => amount.amount * (1 + payment.tax / 100)
        ))
        .flat()
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    const getTotal = () => {
        return account.payments.map(
            payment => payment.amounts.map(
                item => item.amount * (1 + payment.tax / 100)
            )
        )
        .flat()
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    return(
        <Modal
            animationType='fade'
            transparent={true}
            visible={summary}
        >
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.header}>
                        <View 
                            style={styles.close} 
                            onTouchEnd={() => dispatch(setSummaryVisible(false))}
                        >
                            <AntDesign 
                                name='close' 
                                size={30} 
                                color={theme.third}
                            />
                        </View>
                    </View>
                    <ScrollView>
                        {account.users.map((item) => (
                            <Item 
                                key={item.id} 
                                name={item.name}
                                amount={
                                    getUserTotalPay(item.id) - getUserTotalDue(item.id)
                                }
                            />
                        ))}
                    </ScrollView>
                    <Total amount={getTotal()}/>
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
    box: {
        flex: 1,
        marginVertical: 60,
        marginHorizontal: 30,
        backgroundColor: theme.primary,
        padding: 40,
        alignSelf: 'stretch',
        borderRadius: 10,
    },
    close: {
        marginBottom: 10,
        padding: 10,
    },
    header: {
        flexDirection: 'row'
    },
    content: {
        marginTop: 20
    },
    element: {
        flexDirection: 'row',
    },
    topic: {
        flex: 1,
    },
    item: {
        fontSize: 18,
        color: theme.text
    },
    item_positive: {
        fontSize: 18,
        color: 'lime'
    },
    item_negative: {
        fontSize: 18,
        color: 'red'
    },
    total: {
        fontSize: 25,
        color: theme.text
    }
});