require("dotenv").config();

console.log("Current environment is ====>", process.env.NODE_ENV);

const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_KEY: process.env.CLOUD_API,
  CLOUD_SECRET: process.env.CLOUD_SECRET,
};

module.exports = envVars;
