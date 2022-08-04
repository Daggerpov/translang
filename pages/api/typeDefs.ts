import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    type User {
        id: ID
    }

    type Query {
        getUser: User
    }
`;
