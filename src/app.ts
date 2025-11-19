import express, { Express } from "express";
import morgan from "morgan";
import playerRoutes from "../src/api/nba/routes/playerRoutes"

const app: Express = express();

// Add loggers here

app.use(express.json());
app.use(morgan("combined"));

// Add Routes here
app.use("/api/nba/player", playerRoutes);

export default app;