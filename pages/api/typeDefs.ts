//@ts-nocheck

import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    # scalar Date

    type Query {
        hello: String!
        getTestUsers: [testUser!]!
        # getUser: User
        # getComplaint: Complaint
    }

    type testUser {
        id: ID!
        name: String!
    }

    # type User {
    #     id: ID!
    #     displayName: String!
    #     email: String!
    #     authProvider: String!
    #     superuser: Boolean!
    # }

    # type Complaint {
    #     userInfo: User! #! unsure about the type here
    #     time: Date!
    #     isAccepted: Boolean!
    #     submissionCode: String!
    #     additioanlNotes: String
    #     title: String
    #     rating: Int!
    #     faultyLines: [Int]
    # }

    type Mutation {
        # createUser(
        #     displayName: String!
        #     email: String!
        #     authProvider: String!
        #     superuser: Boolean!
        # ): User!

        createTestUser(name: String!): testUser!
        # createComplaint(title: String!, body: String!, user: String!): Post!
    }
`;