import fetch from "node-fetch";
import Logger from "./Logger";
import pkg from "../../../package.json";
import { io } from "../server";

checkVersion();

export async function checkVersion(socketOnly?: boolean): Promise<void | undefined> {
  const url = "https://dev-caspertheghost.github.io/version.html";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const message = data.message
      ? data.message
      : "Your CAD version is NOT up to date, Please consider updating.";

    if (socketOnly) {
      io.sockets.emit("VERSION_CHECK", pkg.version, data.snailycad);
      return;
    }

    logVersion(data.snailycad !== pkg.version, message);
  } catch (e) {
    Logger.error("UPDATER", e);
  }
}

function logVersion(v: boolean, message: string) {
  if (v) {
    Logger.error("UPDATER", message);
  } else {
    Logger.log("UPDATER", "Your CAD version is up to date.");
  }
}
