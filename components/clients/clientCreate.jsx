import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client';

import { client_create, order_query } from './graphql';
import { orders_query } from '../orders/graphql';
import Error from '../assets/error';
import Loading from '../assets/loading';

export default function ClientCreate(props){
    const [errorVisible, setErrorVisible] = useState(false);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [client, {loading}] = useMutation(client_create, {
        refetchQueries:[{query: order_query,
            variables: {id: props.id}
        }]
    });

    const handleCreate = async () => {
        try{
            await client({
                variables: {
                    id: props.id,
                    name: name,
                    amount: amount,
                }
            });
            props.setVisible(false);
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
    }

    const handleExit = () => {
        props.setVisible(false)
    }

    return(
        <Modal transparent={true} visible={props.visible} animationType='slide'>
            <Error 
                error={error} 
                visible={errorVisible} 
                setVisible={setErrorVisible}
            />
            <Loading visible={loading} />
            <View style={styles.modal_container}>
                <View style={styles.modal}>
                    <View style={styles.exit}>
                        <Ionicons 
                            onPress={handleExit} 
                            name="exit-outline" 
                            size={30} 
                            color="black" 
                        />
                    </View>
                    <View style={styles.text_box}>
                        <Text style={styles.text}>New Client</Text>
                        <TextInput
                            style={styles.input} 
                            placeholder='Pick a name'
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input} 
                            placeholder='Pick an amount'
                            keyboardType="numeric"
                            onChangeText={(e) => setAmount(parseInt(e))}
                        />
                        <View>
                            <Button title="create" onPress={handleCreate}/> 
                        </View>
                    </View>
                </View>
            </View>
        </Modal> 
    )
}

const styles = StyleSheet.create({
    modal_container:{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    modal:{
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.25,
        backgroundColor: 'whitesmoke',
        height: 400,
        margin: 50,
        borderRadius: 10,
    },
    exit:{
        flex: 1,
        width: '100%',
        alignItems: 'flex-end',
        padding: 15,
    },
    text_box:{
        flex: 4
    },
    input: {
        width: 250,
        height: 44,
        padding: 10,
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: '#e8e8e8'
    },
    text:{
        fontSize: 35
    }
})