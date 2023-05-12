import { gql } from '@apollo/client';

export const login_query = gql`
    mutation login($username: String!, $password: String!){
        login(username:$username, password:$password){
            login{
                accessToken
                refreshToken
            }
        }
    }`

export const refresh_query = gql`
    mutation token($token: String!){
        refresh(token:$token){
            refresh{
                accessToken
                refreshToken
            }
        }
    }`