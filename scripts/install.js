//! Please don't change anything here.
const { exec } = require("child_process");

const serverDir = "./server"
const clientDir = "./client"

const mainInstall = `npm install`;
const serverInstall = `cd ${serverDir} && npm install`;
const clientInstall = `cd ${clientDir} && npm install`;

async function install() {
  console.log(
    "Please hold tight, I'm installing the required dependencies! (This can take several minutes)\n"
  );


  exec(mainInstall, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Installed 'main' dependencies");
    }
  });
  exec(serverInstall, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Installed 'server' dependencies");
    }
  });
  exec(clientInstall, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Installed 'client' dependencies");
    }
  });
}

install();
