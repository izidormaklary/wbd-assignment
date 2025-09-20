import app from "./app";
import { connectDB } from "@repo/db/client";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");

      console.log("Swagger is running on http://localhost:3000/api-docs");
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
