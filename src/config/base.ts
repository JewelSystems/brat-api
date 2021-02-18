export default {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: '',
    db: 0,
    name: process.env.REDIS_NAME || 'BrAT-ioredis'
  },
  logs: {
    level: 'silly',
  },
};