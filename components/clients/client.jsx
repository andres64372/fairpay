import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Client(props) {

    return(
        <View style={styles.container}>
            <View style={styles.left_container}>
                <Text style={styles.name}>{props.name}</Text>
                <Text style={styles.total}>Total: ${props.total.toLocaleString('es-ES')}</Text>
                <Text style={styles.total}>Total (tip): ${(props.total*(props.tip+100)/100).toLocaleString('es-ES')}</Text>
            </View>
            <View style={styles.right_container}>
                <MaterialIcons onPress={props.onDelete} name="delete-outline" size={45} color="black" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'azure',
        marginTop: 10,
        padding: 10,
        flexDirection: 'row',
    },
    left_container:{
        flex: 1,
    },
    right_container:{
        width: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name:{
        fontSize: 24,
    },
    total:{
        fontSize: 20,
    },
})