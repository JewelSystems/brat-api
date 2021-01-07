const Sequelize = require('sequelize');
const Config = require('../config');

let sequelize;

if (!sequelize) {
  sequelize = new Sequelize(
    Config.sequelize.database,
    Config.sequelize.username,
    Config.sequelize.password,
    Config.sequelize.options,
  );
}

module.exports = sequelize;
