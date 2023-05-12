import { useRef, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, Button, StyleSheet  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { useMutation, HttpLink, useApolloClient } from '@apollo/client'

import { signup_query } from './query'
import Error from '../assets/error'
import Loading from '../assets/loading';

export default function Signup(){
    const [errorVisible, setErrorVisible] = useState(false);
    const [error, setError] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const username = useRef('');
    const passowrd1 = useRef('');
    const passowrd2 = useRef('');
    const navigation = useNavigation();
    const client = useApolloClient();
    const [signup, {loading}] = useMutation(signup_query);  

    const handleSignup = async () => {
        try{
            const {data} = await signup({
                variables: {
                    username: username.current,
                    password: passowrd1.current
                }
            })
            const authLink = setContext((_, { headers }) => {
                return {
                    headers: {
                        ...headers,
                        authorization: `Bearer ${data.signup.signup.accessToken}`,
                    },
                };
            });
            const httpLink = new HttpLink({
                uri: `${environ.HOST}/graphql/`,
            });
            client.setLink(authLink.concat(httpLink)); 
            await AsyncStorage.multiSet([
                ['@fairpay:access_token', data.signup.signup.accessToken],
                ['@fairpay:refresh_token', data.signup.signup.refreshToken]
            ])
            navigation.replace('Orders');
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
    };

    const handleInputs = (inputId, text) => {
        if(inputId === 'password1'){
            passowrd1.current = text;
        }else if(inputId === 'password2'){
            passowrd2.current = text;
        }else{
            username.current = text;
        }
        switch(true){
            case !username.current:
                setDisabled(true);
                break
            case passowrd1.current.length <= 8:
                setDisabled(true);
                break
            case passowrd1.current !== passowrd2.current:
                setDisabled(true);
                break
            default:
                setDisabled(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Error error={error} visible={errorVisible} setVisible={setErrorVisible}/>
            <Loading visible={loading} />
            <Text style={styles.title}>FairPay</Text>
            <TextInput
                style={styles.input} 
                placeholder='Email'
                autoComplete='email'
                keyboardType='email-address'
                onChangeText={text => handleInputs('email', text)}
            />
            <TextInput 
                style={styles.input}
                secureTextEntry={true} 
                placeholder='Password'
                nativeID='passowrd1'
                onChangeText={text => handleInputs('password1', text)}
            />
            <TextInput 
                style={styles.input}
                secureTextEntry={true} 
                placeholder='Confirm Password'
                nativeID='passowrd2'
                onChangeText={text => handleInputs('password2', text)}
            />
            <View style={styles.submit_view}>
                <Button 
                    title='signup' 
                    style={styles.submit_view}
                    onPress={handleSignup}
                    disabled={disabled}
                />
            </View>
            <StatusBar style="light"/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontSize: 60,
        marginBottom: 60,
    },
    input: {
        width: 250,
        height: 44,
        padding: 10,
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: '#e8e8e8'
    },
    submit_view:{
        marginTop: 60,
        marginBottom: 20,
    },
    singup:{
        color: 'blue'
    }
})