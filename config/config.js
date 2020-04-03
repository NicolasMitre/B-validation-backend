module.exports = {
  port: process.env.NODE_PORT || 5000,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "validate_backend",
    connectionLimit: process.env.DB_CONNLIMIT || 10
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || "6379"
  },
  tokenTime: process.env.TOKEN_TIME || 3000,
  resetTime: process.env.RESET_TIME || 3000
};
