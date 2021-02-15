"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import auth from './auth';
const user_1 = __importDefault(require("./user"));
const routes = (app) => {
    //auth(app);
    user_1.default(app);
};
exports.default = routes;
