//@ts-nocheck
import mongoose from "mongoose";

export const testUser = mongoose.model("hello", { name: String });