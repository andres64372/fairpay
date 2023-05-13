import { StyleSheet, View, Modal, Button } from 'react-native';

export default function Filter(props){

    return(
        <Modal 
            transparent={true} 
            visible={props.visible} 
            animationType='slide'
        >

            <View style={styles.modal_container}>
                <View style={styles.modal}>
                    <Button title="all" 
                        onPress={() => {
                            props.setVisible(false)
                            props.setFilter([true,false])
                        }}
                    /> 
                    <Button title="closed only" 
                        onPress={() => {
                            props.setVisible(false)
                            props.setFilter([true])
                        }}
                    />  
                    <Button title="open only" 
                        onPress={() => {
                            props.setVisible(false)
                            props.setFilter([false])
                        }}
                    /> 
                </View>
            </View>
        </Modal> 
    )
}

const styles = StyleSheet.create({
    modal_container:{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        alignItems: 'center'
    },
    modal:{
        justifyContent: 'center',
        shadowOpacity: 0.25,
        backgroundColor: 'whitesmoke',
        height: 100,
        width: 200,
        marginTop: 50,
        borderRadius: 10,
    },
})