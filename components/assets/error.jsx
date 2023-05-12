import { StyleSheet, Text, View, Modal, Button } from 'react-native';

export default function Error(props){
    return(
        <Modal transparent={true} visible={props.visible} animationType='slide'>
            <View style={styles.modal_container}>
                <View style={styles.modal}>
                    <View style={styles.text_box}>
                        <Text style={styles.text}>
                            {props.error}
                        </Text>
                    </View>
                    <View>
                        <Button title="Got It" onPress={() => props.setVisible(false)}/> 
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
        backgroundColor: '#CC0000',
        height: 200,
        margin: 50,
        borderRadius: 10,
    },
    text_box:{
        height: 100,
    },
    text:{
        fontSize: 20,
        color: 'white'
    }
})