//! Please don't change anything here.
const { exec } = require("child_process");
const fs = require("fs")
const path = require("path")

const clientDir = "./client";
const serverDir = "./server";

const mainInstall  = async () => await nodeModulesExist(".") ? "npm ci" : "npm install";
const serverInstall = async () => `cd ${serverDir} && ${await nodeModulesExist("./server") ? "npm ci" : "npm install"}`;
const clientInstall = async () => `cd ${clientDir} && ${await nodeModulesExist("./client") ? "npm ci" : "npm install"}`;

async function install() {
  console.log(
    "Please hold tight, I'm installing the required dependencies! (This can take several minutes)\n"
  );
  const main = await mainInstall()
  const server = await serverInstall()
  const client = await clientInstall()

  exec(main, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Installed 'main' dependencies");
    }
  });
  exec(server, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Installed 'server' dependencies");
    }
  });
  exec(client, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Installed 'client' dependencies");
    }
  });
}

async function nodeModulesExist(p) {
  return fs.existsSync(path.resolve(`${p}/node_modules`))
}

install();
