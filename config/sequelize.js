const { Sequelize } = require("sequelize");

const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: "postgres",
  logging: process.env.PRODUCTION === true,
});

setTimeout(() => {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection to PostgreSQL has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })();
}, 1000);

module.exports = sequelize;
