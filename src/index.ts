import express, { Application } from 'express';
import bp from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import "reflect-metadata";
import * as dotenv from "dotenv";

import websocket from './websockets';
import routes from './routes';
import logger from './loaders/logger';
import { createConnection } from 'typeorm';


dotenv.config();

const app: Application = express();
const port = process.env.SV_PORT || 3000;

// Middlewares 
// Parse application/x-www-form-urlencoded
app.use(bp.urlencoded({ extended: false }));

// Parse application/json
app.use(bp.json());

// Helmet
app.use(helmet());

// Cors
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

routes(app);

// Server
let server = http.createServer(app);

// Websocket
websocket(server);

createConnection();

server.listen(port, () => {
  logger.log("info", `BrAT listening at ${(process.env.SV_ADDRESS || 'http://localhost:') + port}`);
});