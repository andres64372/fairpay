import { gql } from '@apollo/client';

export const orders_query = gql`
    query orders($start: DateTime!, $end: DateTime!){
        allOrders(created_Gte: $start, created_Lte: $end){
            edges{
                node{
                    id
                    created
                    name
                    tip
                    closed
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
            }
        }
    }`    

export const new_order = gql`
    mutation createOrder($tip: Int!, $name: String!){
        createOrder(tip: $tip, name: $name){
            order{
                id
                created
                name
            }
        }
    }`