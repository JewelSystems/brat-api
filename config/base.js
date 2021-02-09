module.exports = {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    password: '',
    db: 0,
    name: 'BrAT-ioredis'
  },
  logs: {
    level: 'silly',
  },
  sequelize: {
    host: 'mysql',
    database: 'brat',
    username: 'root',
    password: 'root',
    options: {
      dialect: 'mysql',
      raw: true,
      define: {
        syncOnAssociation: false
      },
      sync: {
        force: false,
        alter: false
      }
    }
  }
};