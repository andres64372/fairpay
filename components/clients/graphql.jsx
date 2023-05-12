import { gql } from '@apollo/client';

export const order_query = gql`
    query order($id: ID!){
        order(id: $id){
            id
            created
            tip
            clientSet{
                edges{
                    node{
                        id
                        name
                        amount
                    }
                }
            }
        }
    }`

export const client_create = gql`
    mutation createClient($id: ID!, $name: String!, $amount: Float!){
        createClient(id: $id, name: $name, amount: $amount){
            client{
                id
                name
                amount
            }
        }
    }`

export const client_delete = gql`
    mutation deleteClient($id: ID!){
            deleteClient(id: $id){
            client{
                status
            }
        }
    }`

export const order_delete = gql`
    mutation deleteOrder($id: ID!){
        deleteOrder(id: $id){
            order{
                status
            }
        }
    }`

export const order_open = gql`
    mutation updateOrder($id: ID!, $closed: Boolean!){
        updateOrder(id: $id, closed: $closed){
            order{
                id
                closed
            }
        }
    }`

export const order_tip = gql`
    mutation updateOrder($id: ID!, $tip: Int!){
        updateOrder(id: $id, tip: $tip){
            order{
                id
                tip
            }
        }
    }`