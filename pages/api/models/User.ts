//@ts-nocheck

import mongoose from "mongoose";

export const User = mongoose.model(
    "User",
    new Schema({
        displayName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        authProvider: {
            type: String,
            required: true,
        },

        superuser: {
            type: Boolean,
            required: true,
        },

        //         posts: [
        //             {
        //                 type: mongoose.Types.ObjectId,
        //                 ref: "Post",
        //             },
        //         ],

        //         comments: [
        //             {
        //                 type: mongoose.Types.ObjectId,
        //                 ref: "Comment",
        //             },
        //         ],
    })
);

// const Post = mongoose.model(
//     "Post",

//     new Schema({
//         title: {
//             type: String,
//             required: true,
//         },

//         body: {
//             type: String,
//             required: true,
//         },

//         user: {
//             type: mongoose.Types.ObjectId,
//             ref: "User",
//         },

//         comments: [
//             {
//                 type: mongoose.Types.ObjectId,
//                 ref: "Comment",
//             },
//         ],
//     })
// );