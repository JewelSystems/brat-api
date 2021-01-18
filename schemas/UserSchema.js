const Joi = require('joi');

exports.signup = Joi.object({
  first_name: Joi.string().min(1).max(50).required(),
  last_name: Joi.string().min(1).max(50).required(),
  username: Joi.string().min(1).max(80).required(),
  nickname: Joi.string().min(1).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
  gender: Joi.string().min(1).max(1).required(),
  birthday: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
  phone_number: Joi.string().max(17).required(),
  stream_link: Joi.string().uri(),
  twitch: Joi.string().uri(),
  twitter: Joi.string().uri(),
  facebook: Joi.string().uri(),
  instagram: Joi.string().uri(),
  youtube: Joi.string().uri(),
});