import express, { Express } from "express";
import morgan from "morgan";
import playerRoutes from "../src/api/nba/routes/playerRoutes"
import coachRoutes from "../src/api/nba/routes/coachRoutes";
import teamRoutes from "../src/api/nba/routes/teamRoutes";
import matchRoutes from "../src/api/nba/routes/matchRoutes";

const app: Express = express();

// Add loggers here

app.use(express.json());
app.use(morgan("combined"));

// Add Routes here
app.use("/api/nba/player", playerRoutes);
app.use("/api/nba/coach", coachRoutes);
app.use("/api/nba/teams", teamRoutes);
app.use("/api/nba/matches", matchRoutes);

export default app;