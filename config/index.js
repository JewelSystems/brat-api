//const fs = require('fs');

let Config = require('./base');

//if (fs.existsSync(`${__dirname}/config.${process.env.NODE_ENV}.js`)) Object.assign(Config, require(`./config.${process.env.NODE_ENV}`));
//else Object.assign(Config, require('./config.development.js'));

module.exports = Config;
