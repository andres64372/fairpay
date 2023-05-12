import { gql } from '@apollo/client'

export const signup_query = gql`
    mutation signup($username: String!, $password: String!){
        signup(username:$username, password:$password){
            signup{
                accessToken
                refreshToken
            }
        }
    }`