// @ts-nocheck

import { ApolloServer, gql } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// const expressApp = express();

const typeDefs = gql`
    type Query {
        hello: String!
    }
`;

const resolvers = {
    Query: {
        hello: () => "hello world",
    },
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startserver = apolloServer.start();

export default async function handler(req, res) {
    await startserver;
    await apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res);
}

export const config = {
    api: {
        bodyParser: false,
    },
};
