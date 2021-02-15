"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = {
    signup: joi_1.default.object({
        first_name: joi_1.default.string().min(1).max(50).required(),
        last_name: joi_1.default.string().min(1).max(50).required(),
        username: joi_1.default.string().min(1).max(80).required(),
        nickname: joi_1.default.string().min(1).max(80).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).max(64).required(),
        gender: joi_1.default.string().min(1).max(1).required(),
        birthday: joi_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
        phone_number: joi_1.default.string().max(17).required(),
        stream_link: joi_1.default.string().uri(),
        twitch: joi_1.default.string().uri(),
        twitter: joi_1.default.string().uri(),
        facebook: joi_1.default.string().uri(),
        instagram: joi_1.default.string().uri(),
        youtube: joi_1.default.string().uri(),
    })
};
