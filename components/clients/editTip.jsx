import { useState } from 'react';
import { StyleSheet, TextInput, View, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client';

import { order_tip, order_query } from './graphql';
import { orders_query } from '../orders/graphql';
import Error from '../assets/error';
import Loading from '../assets/loading';

export default function EditTip(props){
    const [errorVisible, setErrorVisible] = useState(false);
    const [error, setError] = useState(null);
    const [tip, setTip] = useState(0);
    const [updateTip, {loading}] = useMutation(order_tip, {
        refetchQueries:[{query: order_query}, {query: orders_query}]
    });

    const handleCreate = async () => {
        try{
            await updateTip({
                variables: {
                    id: props.id,
                    tip: tip,
                }
            });
            props.setTip(tip);
            props.setVisible(false)
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
        
    }

    const handleExit = () => {
        props.setVisible(false)
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
                            onPress={handleExit} 
                            name="exit-outline" 
                            size={30} 
                            color="black" 
                        />
                    </View>
                    <View style={styles.text_box}>
                        <TextInput
                            style={styles.input} 
                            placeholder="Tip"
                            keyboardType="numeric"
                            onChangeText={(e) => setTip(parseInt(e))}
                        />
                        <View>
                            <Button title="set" onPress={handleCreate}/> 
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
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    modal:{
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.25,
        backgroundColor: 'whitesmoke',
        height: 200,
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
    }
})