import redis from 'ioredis';
import config from '../config';
import logger from './logger';

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

export default RedisClient;