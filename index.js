require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const logger = require('./loaders/logger');

const app = express();
const port = 3000;

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

// App routes
routes(app);

// Server
let server = http.createServer(app);

server.listen(port, () => {
  logger.log("info", `BrAT listening at http://localhost:${port}`);
});

// Websocket
require('./websockets')(server);