// @ts-nocheck

import { ApolloServer} from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";


import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { User } from "./models/User";
import { testUser } from "./models/testUser";

import { mongoose } from "mongoose";
mongoose.connect(
    process.env.DB_URI
).then(() => {
    app.listen(3000);
});

// const Daggerpov = new User({ displayName: "Daniel Agapov" });
// Daggerpov.save().then(() => console.log("daggerpov is here"));

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    // playground: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
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
