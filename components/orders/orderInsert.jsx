import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client';

import { new_order, orders_query } from './graphql'
import Error from '../assets/error';
import Loading from '../assets/loading';

const date = new Date()

const getToday = (date) => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )
}

export default function OrderInsert(props){
    const [errorVisible, setErrorVisible] = useState(false);
    const [error, setError] = useState(null);
    const [name, setName] = useState(null);
    const [tip, setTip] = useState(0);
    const [order, {loading}] = useMutation(new_order, {
        refetchQueries:[{
            query: orders_query, 
            variables: {
                start: getToday(date),
                end: getToday(date).addDays(1)
        }}]
    });

    const handleCreate = async () => {
        try{
            await order({
                variables: {
                    tip: tip,
                    name: name
                }
            });
            props.setVisible(false);
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
    }

    return(
        <Modal 
            transparent={true} 
            visible={props.visible} 
            animationType='slide'
        >
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
                            onPress={() => props.setVisible(false)} 
                            name="exit-outline" 
                            size={30} 
                            color="black" 
                        />
                    </View>
                    <View style={styles.text_box}>
                        <Text style={styles.text}>New Order</Text>
                        <TextInput
                            style={styles.input} 
                            placeholder='Pick a name'
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input} 
                            placeholder='Pick a tip'
                            keyboardType="numeric"
                            onChangeText={(e) => setTip(parseInt(e))}
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