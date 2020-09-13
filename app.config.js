const execSync = require("child_process").execSync;

const packageJson = require("./package.json");
const gitRev = execSync("git rev-parse --short HEAD", { encoding: "utf-8" });

module.exports = {
  version: `v${packageJson.version}.${gitRev}`,
  title: "エアフラスタメーカー",
  description: "エアフラスタを作って思いを届けましょう！",
  keywords: "エアフラスタ,フラスタ,フラワースタンド",
  ogpUrl: "http://flower-stand.web.app/",
  ogpImage: "",
};
