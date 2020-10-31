import fetch from "node-fetch";
import Logger from "./Logger";
import config from "../../config";
import pkg from "../../../package.json";

if (!config.port) {
  Logger.throw("ERROR", "'port' is required!");
}

if (!config.clientUrl) {
  Logger.throw("ERROR", "'clientUrl' is required!");
}

(async function checkVersion() {
  const url = "https://dev-caspertheghost.github.io/version.html";
  
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.snailycad !== pkg.version) {
      Logger.error(
        "UPDATER",
        "Your CAD version is NOT up to date, Please consider updating."
      );
    } else {
      Logger.log("UPDATER", "Your CAD version is up to date.");
    }
  } catch (e) {
    Logger.error("UPDATER", e);
  }
})();
