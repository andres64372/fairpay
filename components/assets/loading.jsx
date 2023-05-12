import React, { useEffect } from 'react';
import { Animated, StyleSheet, View, Modal } from 'react-native';

export default function Loading(props){
    const rotateValue = new Animated.Value(0);
    const spin = () => {
        rotateValue.setValue(0);
        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
        }).start(() => spin())
    }
    useEffect(() => {
        spin()
    }, [rotateValue]);

    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return(
        <Modal 
            style={styles.modal_container}
            visible={props.visible}
            transparent={true}
        >
            <View style={styles.modal}>
                <Animated.View style={{transform: [{rotate}]}}>
                    <View style={styles.spinner}/>
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal_container:{
        flex: 1,
    },
    modal:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    spinner:{
        borderColor: 'steelblue',
        borderWidth: 8,
        borderTopColor: 'lavender',
        width: 200,
        height: 200,
        borderRadius: 100,
    }
})