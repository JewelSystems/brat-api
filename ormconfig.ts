export = {
  "type": "mysql",
  "host": process.env.DB_HOST || "localhost",
  "port": Number(process.env.DB_PORT) || 3306,
  "username": process.env.DB_USER || "root",
  "password": process.env.DB_PASS || "root",
  "database": process.env.DB_NAME || "brat",
  "synchronize": false,
  "logging": false,
  "entities": [
    "src/models/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/models"
  }
};