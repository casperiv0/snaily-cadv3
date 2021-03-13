import fetch from "node-fetch";
import Logger from "./Logger";
import pkg from "../../../package.json";

checkVersion();

export async function checkVersion(sendMessage = true): Promise<void | null> {
  const url = "https://dev-caspertheghost.github.io/version.html";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const message = data.message
      ? data.message
      : "Your CAD version is NOT up to date, Please consider updating.";

    if (sendMessage) {
      logVersion(data.snailycad !== pkg.version, message);
    }

    return data.snailycad;
  } catch (e) {
    Logger.error("UPDATER", e);

    return null;
  }
}

function logVersion(v: boolean, message: string) {
  if (v) {
    Logger.error("UPDATER", message);
  } else {
    Logger.log("UPDATER", "Your CAD version is up to date.");
  }
}
