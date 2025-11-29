import express, { Express } from "express";
import morgan from "morgan";
import playerRoutes from "../src/api/nba/routes/playerRoutes"
import coachRoutes from "../src/api/nba/routes/coachRoutes";
import teamRoutes from "../src/api/nba/routes/teamRoutes";
import matchRoutes from "../src/api/nba/routes/matchRoutes";
import possessionsRoutes from "../src/api/nba/routes/possessionsRoutes";
import leagueStandingsRoutes from "../src/api/nba/routes/leagueStandingsRoutes"
import setupSwagger from "../config/swagger";

const app: Express = express();
// Add loggers here

app.use(express.json());
app.use(morgan("combined"));

// Add Routes here
app.use("/api/nba/player", playerRoutes);
app.use("/api/nba/coach", coachRoutes);
app.use("/api/nba/teams", teamRoutes);
app.use("/api/nba/matches", matchRoutes);
app.use("/api/nba/possessions", possessionsRoutes);
app.use("/api/nba/standings", leagueStandingsRoutes);

setupSwagger(app);

export default app;