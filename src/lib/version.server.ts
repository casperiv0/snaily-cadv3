import fetch from "node-fetch";
import { logger } from "./logger";
import pkg from "../../package.json";

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
    logger.error("UPDATER", e);

    return null;
  }
}

function logVersion(v: boolean, message: string) {
  if (v) {
    logger.error("UPDATER", message);
  } else {
    logger.log("UPDATER", "Your CAD version is up to date.");
  }
}
