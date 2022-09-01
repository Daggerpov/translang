//@ts-nocheck
import { testUser } from "./models/testUser";

export const resolvers = {
    Query: {
        hello: () => "hi",
        getTestUsers: async () => {
            return await testUser.find();
            // return { users };
        }
        // getTestUsers: () => testUser.find() // !throws "query was already executed error"
    //     getUsers: async () => {
    //         const users = await UserInfo.find({});
    //         return { users };
    //     },
    //     getComplaint: () => {
    //         return {
    //             time: "this is the time that the complaint was submitted",
    //         };
    //     },
    },
    Mutation: {
        // createUser: async (displayName, email, authProvider, superuser) => {
        //     const User = new User({
        //         displayName,
        //         email,
        //         authProvider,
        //         superuser,
        //     });
        //     await User.save();
        //     return User;
        // },
        createTestUser: async (_, { name }) => { // the _ symbolizes the parent, which I don't need
            const testUserInstance = new testUser({ name });
            await testUserInstance.save();
            console.log(testUserInstance);
            return testUserInstance;
        },
    },
};
