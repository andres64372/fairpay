import { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { useMutation, HttpLink, useApolloClient } from '@apollo/client';
import environ from '../../config';

import {login_query, refresh_query} from './graphql'
import Error from '../assets/error'
import Loading from '../assets/loading';

export default function Login(){
    const [errorVisible, setErrorVisible] = useState(false);
    const [error, setError] = useState(null);
    const username = useRef(null);
    const passowrd = useRef(null);
    const navigation = useNavigation();
    const client = useApolloClient();
    const [login, {loading: loading_login}] = useMutation(login_query);  
    const [token, {loading: loading_token}] = useMutation(refresh_query) 

    useEffect(() => {
        const getToken = async () => {
            const tokens = await AsyncStorage.multiGet(['@fairpay:access_token', '@fairpay:refresh_token'])
            const refresh = tokens[1][1]
            if(refresh){
                try{
                    const {data} = await token({
                        variables: {
                            token: refresh,
                        }
                    });
                    const accessToken = data.refresh.refresh.accessToken;
                    const authLink = setContext((_, { headers }) => {
                        return {
                            headers: {
                                ...headers,
                                authorization: `Bearer ${accessToken}`,
                            },
                        };
                    });
                    const httpLink = new HttpLink({
                        uri: `${environ.HOST}/graphql/`,
                    });            
                    client.setLink(authLink.concat(httpLink));
                    navigation.replace('Orders');
                }catch(err){
                    setError(err.message)
                    setErrorVisible(true)
                }
            }
        }
        getToken()
    },[])

    const handleLogin = async () => {
        try{
            const {data} = await login({
                variables: {
                    username: username.current,
                    password: passowrd.current
                }
            });
            const authLink = setContext((_, { headers }) => {
                return {
                    headers: {
                        ...headers,
                        authorization: data.login.login.accessToken ? `Bearer ${data.login.login.accessToken}` : '',
                    },
                };
            });
            const httpLink = new HttpLink({
                uri: `${environ.HOST}/graphql/`,
            });            
            client.setLink(authLink.concat(httpLink));
            await AsyncStorage.multiSet([
                ['@fairpay:access_token', data.login.login.accessToken],
                ['@fairpay:refresh_token', data.login.login.refreshToken]
            ]);
            navigation.replace('Orders');
        }catch(err){
            console.log(err.message);
            setError(err.message)
            setErrorVisible(true)
        }
    };

    const handleInputs = (inputId, text) => {
        if(inputId === 'password'){
            passowrd.current = text;
        }else{
            username.current = text;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Error error={error} visible={errorVisible} setVisible={setErrorVisible}/>
            <Loading visible={loading_login || loading_token} />
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
                onChangeText={text => handleInputs('password', text)}
            />
            <View style={styles.submit_view}>
                <Button 
                    title='Login' 
                    style={styles.submit_view}
                    onPress={handleLogin}
                />
            </View>
            <Text 
                style={styles.singup}
                onPress={() => navigation.navigate('Signup')}
            >
                Don't you have an account?
            </Text>
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