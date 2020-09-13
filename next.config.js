const app = require("./app.config");

const isProduction = process.env.NODE_ENV === "production";

const env = {
  ...app,
};

module.exports = {
  env,
};
