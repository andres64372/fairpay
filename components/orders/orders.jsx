import { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';

import {orders_query} from './graphql'
import Order from './order'
import Error from '../assets/error'
import Loading from '../assets/loading';
import OrderInsert from './orderInsert'  

const today = new Date()

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export default function Orders() {
    const [errorVisible, setErrorVisible] = useState(false);
    const [newOrder, setNewOrder] = useState(false);
    const [date, setDate] = useState(new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    ));
    const [show, setShow] = useState(false);
    const navigation = useNavigation();
    const { loading, error, data } = useQuery(orders_query, {
        variables: {
            start: date,
            end: date.addDays(1)
        }
    });

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['@fairpay:access_token', '@fairpay:refresh_token']);
        navigation.replace('Home');
    }

    if(error){
        console.log(error);
        handleLogout()
        return
    }

    const onDateChange = (event, selectedDate) => {
        setShow(false);
        const newDate = new Date(selectedDate);
        setDate(newDate);
    };

    return (
        <SafeAreaView style={styles.container}>
            <OrderInsert 
                visible={newOrder} 
                setVisible={setNewOrder} 
            />
            <Error 
                error={error} 
                visible={errorVisible} 
                setVisible={setErrorVisible}
            />
            <Loading visible={loading} />
            <View style={styles.header}>
                <View style={styles.name_field}>
                    <View style={styles.add_field}>
                        <Feather
                            name="calendar"
                            size={32}
                            color="black"
                            style={{ width: 40 }}
                            onPress={() => setShow(true)}
                        />
                        <AntDesign
                            name="plus"
                            size={32}
                            color="black"
                            style={{ width: 40 }}
                            onPress={() => setNewOrder(true)}
                        />
                    </View>
                    <Text>
                        {date.getFullYear()}-{('0' + (date.getMonth() + 1)).slice(-2)}-{('0' + date.getDate()).slice(-2)}
                    </Text>
                </View>
                <View style={styles.logout_field}>
                    <AntDesign
                        name="logout"
                        size={32}
                        color="black"
                        style={{ width: 40 }}
                        onPress={handleLogout}
                    />
                </View>
                
            </View>
            <ScrollView>
                {data && data.allOrders.edges.map((order, index) => {
                    const total = order.node.clientSet.edges.reduce((accumulator, object) => {
                        return accumulator + object.node.amount;
                    }, 0) * (order.node.tip + 100) / 100;
                    return (
                        <Order
                            key={index}
                            id={order.node.id}
                            name={order.node.name}
                            created={new Date(order.node.created)}
                            tip={order.node.tip}
                            closed={order.node.closed}
                            total={total}
                        />
                    )
                })}

            </ScrollView>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onDateChange}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    name_field: {
        paddingLeft: 15,
        flex: 1,
    },
    logout_field: {
        flex: 1,
        alignItems: 'flex-end',
    },
    add_field: {
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 40,
    }
});