import serverlessHandler from "@codegenie/serverless-express";
import app from "./app";
import { connectDB } from "@repo/db/client";

// Establish database connection
let isConnected = false;

export const handler = serverlessHandler({
  app,
});

// Initialize database connection on cold start
const initializeDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }
};

// Call initializeDB when the module loads
initializeDB().catch(console.error);
