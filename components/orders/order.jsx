import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Order(props){
    const navigation = useNavigation();
      
    return(
        <View 
            style={styles.container} 
            onTouchEnd={() => navigation.navigate('Clients', {
                id: props.id, 
                name: props.name,
                created: props.created.toString(), 
                tip: props.tip,
                closed: props.closed
            })}
        >   
            <View style={styles.left_container}>
                <Text style={styles.name}>{props.name}</Text>
                {props.closed ?
                <Text style={styles.total}>
                    <Ionicons name="lock-closed-outline" size={24} color="red" />
                    Total: ${props.total.toLocaleString('es-ES')}
                </Text>
                :
                <Text style={styles.total}>
                    <Ionicons name="lock-open-outline" size={24} color="green" />
                    Total: ${props.total.toLocaleString('es-ES')}
                </Text>
                }   
            </View>
            <View style={styles.right_container}>
                <Text>
                    {('0' + props.created.getHours()).slice(-2)}:{('0' + props.created.getMinutes()).slice(-2)}
                </Text>
                <Text style={styles.total}>
                    Tip: {props.tip}%
                </Text>
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
        width: 100,
    },
    name:{
        fontSize: 24,
    },
    total:{
        fontSize: 20,
    },
    time:{
        fontSize: 10,
    }
})