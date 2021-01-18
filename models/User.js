const crypto = require('crypto');
const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const moment = require('moment');

let User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  salt: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  phone_number: DataTypes.STRING(25),
  stream_link: DataTypes.STRING(100),
  twitch: DataTypes.STRING(100),
  twitter: DataTypes.STRING(100),
  facebook: DataTypes.STRING(100),
  instagram: DataTypes.STRING(100),
  youtube: DataTypes.STRING(100),
  reset_token: DataTypes.STRING(64),
  created: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  updated: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'User',
  tableName: 'users',
  hooks:{
    beforeCreate: async user => {
      let passwordData = await User.salt(user.password);
      user.password = passwordData.passwordHash;
      user.salt = passwordData.salt;
      user.status = 'PendingEmail';
      user.created = moment().unix();
      user.updated = moment().unix();
    },
  }
});

User.salt = async function(password) {
  let salt =  crypto.randomBytes(Math.ceil(64/2))
    .toString('hex')
    .slice(0,64);
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt,
    passwordHash: value
  };
};

User.login = async function(username, password) {
  let userFound = await User.findOne({where:{username}});
  let salt = userFound.salt;
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  if (value == userFound.password) return true;
  return false;
};

module.exports = User;
