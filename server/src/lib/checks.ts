import config from "../../config";
import Logger from "./Logger";

if (!config.port) {
  Logger.throw("ERROR", "'port' is required!");
}

if (!config.clientUrl) {
  Logger.throw("ERROR", "'clientUrl' is required!");
}
