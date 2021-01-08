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
  tableName: 'users'
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

User.signup = async function(first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  let passwordData = await this.salt(password);

  let createUser = await User.create({
    first_name: first_name,
    last_name: last_name,
    username: username,
    email: email,
    password: passwordData.passwordHash,
    salt: passwordData.salt,
    gender: gender,
    phone_number: phone_number,
    stream_link: stream_link,
    twitch: twitch,
    twitter: twitter,
    facebook: facebook,
    instagram: instagram,
    youtube: youtube,
    status: 'PendingEmail',
    reset_token: 1,
    created: moment().unix(),
    updated: moment().unix(),
  });

  if (createUser) return createUser;
  return false;
};

User.get = async function(id) {
  let user = await User.findOne({where:{id}});
  
  if (user) return user;
  return false;
};

User.update = async function(id, first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  let passwordData = await this.salt(password);
  await User.update({
    first_name: first_name,
    last_name: last_name,
    username: username,
    email: email,
    password: passwordData.passwordHash,
    salt: passwordData.salt,
    gender: gender,
    phone_number: phone_number,
    stream_link: stream_link,
    twitch: twitch,
    twitter: twitter,
    facebook: facebook,
    instagram: instagram,
    youtube: youtube,
    updated: moment().unix(),
  },{
    where:{id}
  });
  return true;
  /*
  let curUser = await User.findOne({where:{id}});
  curUser.first_name = first_name;
  curUser.last_name = last_name;
  curUser.username = username;
  curUser.email = email;
  curUser.password = passwordData.passwordHash;
  curUser.salt = passwordData.salt;
  curUser.gender = gender;
  curUser.phone_number = phone_number;
  curUser.stream_link = stream_link;
  curUser.twitch = twitch;
  curUser.twitter = twitter;
  curUser.facebook = facebook;
  curUser.instagram = instagram;
  curUser.youtube = youtube;
  curUser.status = 'Active';
  curUser.reset_token = 1;
  curUser.updated = moment().unix();

  let updatedUser = await curUser.save();
  */
};

User.delete = async function(id) {
  let del = await User.destroy({where:{id}});
  
  if (del) return true;
  return false;
};

module.exports = User;
