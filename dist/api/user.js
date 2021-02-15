"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSchema_1 = __importDefault(require("../schemas/UserSchema"));
exports.default = {
    create(firstName, lastName, username, nickname, email, password, gender, birthday, phoneNumber, streamLink, twitch, twitter, facebook, instagram, youtube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Schema Validation
            try {
                yield UserSchema_1.default.signup.validateAsync({
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    nickname: nickname,
                    email: email,
                    password: password,
                    gender: gender,
                    birthday: birthday,
                    phone_number: phoneNumber,
                    stream_link: streamLink,
                    twitch: twitch,
                    twitter: twitter,
                    facebook: facebook,
                    instagram: instagram,
                    youtube: youtube,
                });
            }
            catch (error) {
                // Joi Schema validation error
                return {
                    status: 403,
                    body: {
                        error: error
                    }
                };
            }
            //typeorm
            return {
                status: 200,
                body: {
                    success: "OK"
                }
            };
        });
    }
};
