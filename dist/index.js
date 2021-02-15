"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//require('dotenv').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./loaders/logger"));
const app = express_1.default();
const port = 3000;
// Middlewares 
// Parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Parse application/json
app.use(body_parser_1.default.json());
// Helmet
app.use(helmet_1.default());
// Cors
app.use(cors_1.default({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
routes_1.default(app);
// Server
let server = http_1.default.createServer(app);
// Websocket
//require('./websockets')(server);
server.listen(port, () => {
    logger_1.default.log("info", `BrAT listening at http://localhost:${port}`);
});
