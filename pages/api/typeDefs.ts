//@ts-nocheck

import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    scalar Date 

    type User {
        id: ID!
        displayName: String!
        authProvider: String!
        email: String!
        superuser: Boolean!
    }

    type Complaint {
        userInfo: User! #! unsure about the type here
        time: Date!
        isAccepted: Boolean
        submissionCode: String!
        additioanlNotes: String
        title: String
        rating: Int!
    }

    type Query {
        getUser: User
        getComplaint: Complaint
    }
`;
