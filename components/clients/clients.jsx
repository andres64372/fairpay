import { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client';

import { order_query, 
	client_delete, 
	order_delete, 
	order_open } from './graphql'
import { orders_query } from '../orders/graphql';
import Client from './client'
import ClientCreate from './clientCreate';
import EditTip from './editTip'

import Error from '../assets/error'
import Loading from '../assets/loading';

const getToday = (date) => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export default function Clients(props) {
	const id = props.route.params.id;
	const name = props.route.params.name;
	const date = new Date(props.route.params.created);

	const [close, setClose] = useState(props.route.params.closed);
	const [tip, setTip] = useState(props.route.params.tip);
	const [errorVisible, setErrorVisible] = useState(false);
	const [error, setError] = useState(null);
	const [newClient, setNewClient] = useState(false);
	const [newTip, setNewTip] = useState(false);
	const navigation = useNavigation();
	const { loading: loading_query, error: query_error, data } = useQuery(order_query, {
		variables: {id: id}
	});
	const [delete_client, {loading: loading_delete_client}] = useMutation(client_delete, {
        refetchQueries:[{query: order_query,
			variables: {id: id}
		}]
    });
	const [delete_order, {loading: loading_delete_order}] = useMutation(order_delete, {
        refetchQueries:[{
			query: orders_query,
			variables: {
				start: getToday(date),
                end: getToday(date).addDays(1)
			}
		}]
    });
	const [open_order, {loading: loading_open_order}] = useMutation(order_open, {
        refetchQueries:[{query: orders_query}]
    });

	if(query_error){
		console.log(query_error)
        navigation.goBack()
    }

	const total = data?.order.clientSet.edges.reduce((accumulator, object) => {
		return accumulator + object.node.amount;
	}, 0) * (tip + 100) / 100;

	const handleOpenOrder = async () => {
		try{
            await open_order({
                variables: {
                    id: id,
					closed: !close
                }
            });
			setClose(!close);
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
	}

	const handleDeleteOrder = async () => {
		try{
            const {data} = await delete_order({
                variables: {
                    id: id,
                }
            });
			if(!data?.deleteOrder.order.status){
				setError('Client Not Deleted')
            	setErrorVisible(true)
			}else{
				navigation.replace('Orders');
			}
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
		
	}

	const handleDeleteClient = async (index) => {
		try{
            const {data} = await delete_client({
                variables: {
                    id: index,
                }
            });
			if(!data?.deleteClient.client.status){
				setError('Client Not Deleted')
            	setErrorVisible(true)
			}
        }catch(err){
            setError(err.message)
            setErrorVisible(true)
        }
	}


	return (
		<SafeAreaView style={styles.container}>
			<ClientCreate 
				id={id} 
				visible={newClient} 
				setVisible={setNewClient} 
			/>
			<EditTip
				id={id}  
				visible={newTip} 
				setVisible={setNewTip} 
				setTip={setTip} 
			/>
			<Error 
				error={error} 
				visible={errorVisible} 
				setVisible={setErrorVisible}
			/>
			<Loading visible={loading_query || 
				loading_delete_client || 
				loading_delete_order ||
				loading_open_order}
			/>
			<View style={styles.header}>
				<View style={styles.name_field}>
					<Ionicons
						name="arrow-back"
						size={40}
						color="black"
						onPress={() => navigation.goBack()}
					/>
					<Text style={styles.title}>
						{name}
					</Text>
				</View>
				<View style={styles.add_field}>
					<AntDesign
						name="plus"
						size={45}
						color="black"
						style={{marginRight: 10}}
						onPress={() => setNewClient(true)}
					/>
				</View>
			</View>
			<ScrollView>
				{data && data.order.clientSet.edges.map((client, index) => {
					return (
						<Client
							key={index}
							name={client.node.name}
							total={client.node.amount}
							tip={tip}
							onDelete={() => handleDeleteClient(client.node.id)}
						/>
					)
				})}
			</ScrollView>
			<View style={styles.resume}>
				<View>
					<Text style={styles.tip}>
						Tip: {tip}% <FontAwesome 
							onPress={() => setNewTip(true)} 
							name="edit" 
							size={20} 
							color="black" 
						/>
					</Text>
					<Text style={styles.total}>
						Total: ${total.toLocaleString('es-ES')}
					</Text>
				</View>
				{close &&
				<View style={styles.trash}>
					<MaterialIcons
						name="delete-outline"
						size={70}
						color="black"
						onPress={handleDeleteOrder}
					/>
				</View>
				}
			</View>
			<View
				style={styles.delete_box}
				onTouchEnd={handleOpenOrder}
			>
				<Text style={styles.delete}>
					{close ? 'Open' : 'Close'} Order
				</Text>
			</View>
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
		marginTop: 10,
	},
	name_field: {
		paddingLeft: 15,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	add_field: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	title: {
		fontSize: 35,
	},
	delete_box: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
	},
	resume: {
		paddingTop: 20,
		flexDirection: 'row',
	},
	trash: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginRight: 15,
	},
	delete: {
		fontSize: 18,
		color: 'red',
	},
	total: {
		marginLeft: 15,
		fontSize: 30
	},
	tip: {
		marginLeft: 15,
		fontSize: 20,
	},
});