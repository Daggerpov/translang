//@ts-nocheck
import mongoose from "mongoose";

export const testUser = mongoose.model("TestUser", { name: String });

// export const testUser = mongoose.model(
//     "TestUser",
//     new Schema({
//         name: {
//             type: String,
//             required: true,
//         },
//     })
// );