export const resolvers = {
    Query: {
        getUser: () => {
            return {
                id: "Foo",
            };
        },
        getComplaint: () => {
            return {
                time: "this is the time that the complaint was submitted",
            };
        },

    },
};