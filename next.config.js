const execSync = require("child_process").execSync;

const packageJson = require("./package.json");
const gitRev = execSync("git rev-parse --short HEAD", { encoding: "utf-8" });

const isProduction = process.env.NODE_ENV === "production";

const env = {
  version: `v${packageJson.version}.${gitRev}`,
};

module.exports = {
  env,
};
