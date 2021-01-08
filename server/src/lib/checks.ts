import fetch from "node-fetch";
import Logger from "./Logger";
import pkg from "../../package.json";

(async function checkVersion() {
  const url = "https://dev-caspertheghost.github.io/version.html";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const message = data.message
      ? data.message
      : "Your CAD version is NOT up to date, Please consider updating.";

    if (data.snailycad !== pkg.version) {
      Logger.error("UPDATER", message);
    } else {
      Logger.log("UPDATER", "Your CAD version is up to date.");
    }
  } catch (e) {
    Logger.error("UPDATER", e);
  }
})();
