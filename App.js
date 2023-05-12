import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { StatusBar } from 'react-native';

import Orders from './components/orders/orders'
import Clients from './components/clients/clients';
import Login from './components/login/login'
import Signup from './components/signup/signup';

const HOST = 'https://retropixel-8f415.uc.r.appspot.com'; 

const Stack = createNativeStackNavigator();

const client = new ApolloClient({
    cache: new InMemoryCache,
    link: new HttpLink({
        uri: `${HOST}/graphql/`
    })
})

export default function App() {
    return (
        <ApolloProvider client={client}>
            <StatusBar backgroundColor='#ffffff' barStyle='dark-content'/>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name="Home" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                    <Stack.Screen name="Orders" component={Orders} />
                    <Stack.Screen name="Clients" component={Clients} />
                </Stack.Navigator>
            </NavigationContainer>
        </ApolloProvider>
    );
}