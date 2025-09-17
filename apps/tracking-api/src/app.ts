import express from "express";
import { getUserById, searchUsers } from "./controllers/users";
import { getUserSessions, getSessionById } from "./controllers/sessions";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { geSessionEvents } from "./controllers/events";
import { getGlobalAnalytics, getUserAnalytics } from "./controllers/analytics";
const app = express();

// user routes
app.get("/users", searchUsers);
app.get("/users/:id", getUserById);
app.get("/users/:userId/sessions", getUserSessions); // get all sessions of a user

// session routes
app.get("/sessions/:id", getSessionById);
app.get("/sessions/:sessionId/events", geSessionEvents); // get all events of a session

// analytics routes
app.get("/analytics/global", getGlobalAnalytics);
app.get("/analytics/:userId", getUserAnalytics);

// host swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// not found handler
app.use("*", (_, res) => {
  res.status(404).json({ message: "Route not found", code: 404 });
});

export default app;
