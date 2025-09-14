// mongoose client configuration for the database

import mongoose from "mongoose";

// check if the MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
};
