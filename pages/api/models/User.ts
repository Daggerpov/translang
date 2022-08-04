//@ts-nocheck

import mongoose from "mongoose";

export const User = mongoose.model("User", { displayName: String });
