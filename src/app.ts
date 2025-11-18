import express, { Express } from "express";
import morgan from "morgan";

const app: Express = express();

// Add loggers here

app.use(express.json());
app.use(morgan("combined"));

// Add Routes here


export default app;