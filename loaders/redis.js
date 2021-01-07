const redis = require('ioredis');
const config = require('../config');
const logger = require('./logger');

let RedisClient = new redis(config.redis);
let name = config.redis.name;

(async function(){
  let connected = false;
  setTimeout(() => {
    if (!connected) {
      logger.error("Unable to connect to redis");
      process.exit(1);
    }
  }, 5000);
  await RedisClient.client('SETNAME', name);
  connected = true;
})();

module.exports = RedisClient;